
import supertest from 'supertest'
import { prisma } from '../database.js';
import { deleteSong, insertSong } from './factories/songFactory.js';
import app from '../app.js';
import {jest} from '@jest/globals'
import { recommendationService } from '../services/recommendationsService.js';
import { recommendationController } from '../controllers/recommendationController.js';
import { recommendationSchema } from '../schemas/recommendationsSchemas.js';
import { recommendationRepository } from '../repositories/recommendationRepository.js';
import { getRandom } from '../services/recommendationsService.js';

const agent = supertest(app);

describe('Recommendations route "/recommendations" INTEGRATION TESTS ', () => {

    describe('POST "/"', () => {

        it('should have 5 songs stored when the given input is valid', async() => {
            await insertSong({name:'Here', youtubeLink:'https://www.youtube.com/watch?v=KuZbmLLv1vM'});
            const {body: results} = await agent.get('/recommendations');
            expect(results.length).toBe(5);
            await deleteSong({name:'Here'});
        })

        
    })

    describe('GET "/"', () => {

        it('should retrieve 4 songs when endpoint is requested', async() =>{
            const {body: results} = await agent.get('/recommendations');
            expect(results.length).toBe(4);
        });
    })

    describe('GET /random', () => {
        it('should retrieve a random song when endpoint is requested', async () => {
            const {body: recommendations} = await agent.get('/recommendations');

            const randomSongIndex = Math.floor(Math.random() * recommendations.length);
            jest.spyOn(recommendationService, 'getRandom').mockReturnValue(recommendations[randomSongIndex])
            const {body: randomSong} = await agent.get('/recommendations/random');

            expect(randomSong.name).toEqual(recommendations[randomSongIndex].name);
            
        })
    })

    describe('GET /top', () => {
        it('should retrieve the top rated song', async() => {
            const {body: [topRatedSong]} = await agent.get('/recommendations/top/1');
            expect(topRatedSong.name).toBe('The Rumbling');
        })
    })

    describe('GET /id', () => {
        it('should retrieve the song according to its id', async() => {
            const newSong = await insertSong({name:'Here', youtubeLink:'https://www.youtube.com/watch?v=KuZbmLLv1vM'});
            const {body: searchSong} = await agent.get(`/recommendations/${newSong.id}`);

            expect(newSong.name).toBe(searchSong.name);
            await deleteSong({name:'Here'});

        })
    })

    describe('POST /:id/upvote', () => {
        it('should add one to the score of the song inserted', async() => {
            const newSong = await insertSong({name:'Here', youtubeLink:'https://www.youtube.com/watch?v=KuZbmLLv1vM'});
            await agent.post(`/recommendations/${newSong.id}/upvote`);
            const {body: upvotedNewSong} = await agent.get(`/recommendations/${newSong.id}`);

            expect(upvotedNewSong.score).toEqual(newSong.score + 1);
            await deleteSong({name:'Here'});
        })
    })

    describe('POST /:id/downvote', () => {
        it('should subtract one to the score of the song inserted', async() => {
            const newSong = await insertSong({name:'Here', youtubeLink:'https://www.youtube.com/watch?v=KuZbmLLv1vM'});
            await agent.post(`/recommendations/${newSong.id}/downvote`);
            const {body: downvotedNewSong} = await agent.get(`/recommendations/${newSong.id}`);

            expect(downvotedNewSong.score).toEqual(newSong.score - 1);
            await deleteSong({name:'Here'});
        })

        it('should remove the song with score < -5', async() => {
            const badSong = await prisma.recommendation.findFirst({where:{name: 'Baby'}});
            await agent.post(`/recommendations/${badSong.id}/downvote`);
            const result = await prisma.recommendation.findFirst({where:{name: 'Baby'}});

            expect(result).toBe(null);
        })
    })
})

describe('Recommendations route "/recommendations" UNIT TESTS', () => {


    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    })

    describe('POST "/"', () => {

        it('should throw error 422 if input data is invalid', async() => {

            const results = await agent.post('/recommendations').send({name: 'oi', youtubeLink: 'https://www.hltv.org/'})

            expect(results.statusCode).toEqual(422);
        })

    })

    describe('POST "/upvote"', () => {

        it('should throw error 404 when recommendation is not found', async() => {

            jest.spyOn(recommendationRepository, "find").mockResolvedValue(undefined);
            await recommendationService.upvote(1).catch(e => expect(e.type).toBe('not_found'));

        })
    })

    describe('POST "/downvote"', () => {

        it('should throw error 404 when recommendation is not found', async() => {

            jest.spyOn(recommendationRepository, "find").mockResolvedValue(undefined);
            await recommendationService.downvote(1).catch(e => expect(e.type).toBe('not_found'));

        })
    })

    describe('GET "/random"', () => {

        it('should throw error when recommendations.length equal 0', async() => {
            const expectedResult = [];
            jest.spyOn(recommendationService, 'getByScore').mockResolvedValue(expectedResult);
            const result = await recommendationService.getRandom();
            expect(result).toBe(undefined);

        })
    })
    
})
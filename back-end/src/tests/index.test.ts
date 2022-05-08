
import supertest from 'supertest'
import { prisma } from '../database.js';
import { deleteSong, insertSong } from './factories/songFactory.js';
import app from '../app.js';
import {jest} from '@jest/globals'
import { recommendationService } from '../services/recommendationsService.js';
const agent = supertest(app);

describe('Recommendations route "/recommendations" ', () => {

    describe('POST "/"', () => {

        it('should have 4 songs stored when the given input is valid', async() => {
            await insertSong({name:'Here', youtubeLink:'https://www.youtube.com/watch?v=KuZbmLLv1vM'});
            const {body: results} = await agent.get('/recommendations');
            expect(results.length).toBe(4);
            await deleteSong({name:'Here'});
        })

        
    })

    describe('GET "/"', () => {

        it('should retrieve 3 songs when endpoint is requested', async() =>{
            const {body: results} = await agent.get('/recommendations');
            expect(results.length).toBe(3);
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
        it('should add one to the score of the song inserted', async() => {
            const newSong = await insertSong({name:'Here', youtubeLink:'https://www.youtube.com/watch?v=KuZbmLLv1vM'});
            await agent.post(`/recommendations/${newSong.id}/downvote`);
            const {body: downvotedNewSong} = await agent.get(`/recommendations/${newSong.id}`);

            expect(downvotedNewSong.score).toEqual(newSong.score - 1);
            await deleteSong({name:'Here'});
        })
    })
})
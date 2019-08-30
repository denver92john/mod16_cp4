const expect = require('chai').expect;
const app = require('../app');
const request = require('supertest');

describe('GET /apps', () => {
    it('should be 400 if genre is not included', () => {
        return request(app)
            .get('/apps')
            .query({genres: 'MISTAKE'})
            .expect(400, 'genres must be one of the selected');
    });

    it('should be 400 if sort is not either rating or app', () => {
        return request(app)
            .get('/apps')
            .query({sort: 'MISTAKE'})
            .expect(400, 'Sort must be one of rating or app');
    });

    it('should return an array of apps', () => {
        return request(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const playApp = res.body[0];
                expect(playApp).to.include.all.keys('App', 'Category', 'Rating', 'Genres');
            });
    });

    it('should sort by rating', () => {
        return request(app)
            .get('/apps')
            .query({genres: 'Action', sort: 'rating'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let i = 0;
                let sorted = true;
                while(sorted && i < res.body.length - 1) {
                    sorted = sorted && res.body[i].Rating >= res.body[i + 1].Rating;
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('should sort by app name', () => {
        return request(app)
            .get('/apps')
            .query({genres: 'Action', sort: 'app'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let i = 0;
                let sorted = true;
                while(sorted && i < res.body.length - 1) {
                    sorted = sorted && res.body[i].App.toUpperCase() < res.body[i + 1].App.toUpperCase();
                    i++;
                }
                expect(sorted).to.be.true;                
            });
    });
});
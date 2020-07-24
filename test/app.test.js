const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /apps', () => {
  it('should return an array of google apps from playstore', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      // add a then handler to the chain and get the response object itself
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const googleApp = res.body[0];
        expect(googleApp).to.include.all.keys(
          'App', 'Category', 'Rating', 'Reviews', 'Size', 'Installs', 'Type', 'Price', 'Content Rating', 'Genres', 'Last Updated', 'Current Ver', 'Android Ver'
        );
      });
  })

  it('should be 400 if sort is incorrect', () => {
    return supertest(app)
        .get('/apps')
        .query({sort: 'MISTAKE'})
        .expect(400, 'Sort must be one of Rating or App');
  });

  it('should sort by Rating', () => {
    return supertest(app)
      .get('/apps')
      .query({sort: 'Rating'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;
        
        let i = 0;
        while( sorted && i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];

          sorted = appAtI.Rating <= appAtIPlus1.Rating;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
});


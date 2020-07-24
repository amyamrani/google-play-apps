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

  it('should sort by name of App', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'App' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;
        
        let i = 0;
        while(sorted && i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          
          sorted = sorted && appAtI.App < appAtIPlus1.App;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it('should sort by genres', () => {
    const expected = [
      {
        "App": "Block Puzzle",
        "Category": "GAME",
        "Rating": 4.6,
        "Reviews": "59800",
        "Size": "7.8M",
        "Installs": "5,000,000+",
        "Type": "Free",
        "Price": "0",
        "Content Rating": "Everyone",
        "Genres": "Puzzle",
        "Last Updated": "March 6, 2018",
        "Current Ver": "2.9",
        "Android Ver": "2.3 and up"
      },
      {
        "App": "Block Puzzle Classic Legend !",
        "Category": "GAME",
        "Rating": 4.2,
        "Reviews": "17039",
        "Size": "4.9M",
        "Installs": "5,000,000+",
        "Type": "Free",
        "Price": "0",
        "Content Rating": "Everyone",
        "Genres": "Puzzle",
        "Last Updated": "April 13, 2018",
        "Current Ver": "2.9",
        "Android Ver": "2.3.3 and up"
      }
    ]
    return supertest(app)
      .get('/apps')
      .query({ genres: 'Puzzle' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).eql(expected)
      });
  });
});


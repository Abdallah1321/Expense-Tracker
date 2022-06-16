const mongoose = require('mongoose');
const mockingoose = require('mockingoose');
const User = require("../models/user.model")
const crypto = require("crypto");
const randtoken1 = crypto.randomBytes(32).toString('hex')


describe('test Users', () => {
    it('should return the doc with findById', () => {
      const _doc = {
        _id: '507f191e810c19729de860ea',
        username: "user",
        name: "user",
        password: "12345678",
        isEmailVerified: true,
        email: "user@123.com",
        tokens: [{token : randtoken1}]
      };
  
      mockingoose(User).toReturn(_doc, 'findOne');
  
      return User.findById({ _id: '507f191e810c19729de860ea' }).then(doc => {
        expect(JSON.parse(JSON.stringify(doc.username))).toEqual(_doc.username);
      });
    });

    it('should return the doc with update', () => {
        const _doc = {
            _id: '507f191e810c19729de860ea',
            username: "user",
            name: "user",
            password: "12345678",
            isEmailVerified: true,
            email: "user@123.com",
            tokens: [{token : randtoken1}]
          };
        
        
        mockingoose(User).toReturn(_doc, 'update');
    
        return User.update({ username: "user2" }) // this won't really change anything
          .where({ _id: '507f191e810c19729de860ea' })
          .then(doc => {
            expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
          });
      });

      it('should create the doc', () => {
        const _doc = {
            _id: '507f191e810c19729de860ea',
            username: "user",
            name: "user",
            password: "12345678",
            isEmailVerified: true,
            email: "user@123.com",
            tokens: [{token : randtoken1}]
          };
        
        mockingoose(User).toReturn(_doc, 'save');
    
        return User.findById({ _id: '507f191e810c19729de860ea' }).then(doc => {
            expect(doc.username).toEqual(_doc.username);
          });
        });
      
    it('should delete a doc', () => {
        const _doc = {
            _id: '507f191e810c19729de860ea',
            username: "user",
            name: "user",
            password: "12345678",
            isEmailVerified: true,
            email: "user@123.com",
            tokens: [{token : randtoken1}]
          };
            
        mockingoose(User).toReturn(_doc, 'deleteOne');
        
        return User.findByIdAndDelete({ _id: '507f191e810c19729de860ea' }).then(doc => {
            expect(doc).toBe(undefined);
        });
    });
      
      
      it('should reset model mock', () => {
        mockingoose(User).toReturn({ username: "user" });
        mockingoose(User).toReturn({ username: "user2" }, 'save');
      
        mockingoose(User).reset(); // will reset all operations;
      });
});


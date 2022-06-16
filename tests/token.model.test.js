const mongoose = require('mongoose');
const mockingoose = require('mockingoose');
const Token = require("../models/token.model")
const crypto = require("crypto");
const userId = mongoose.Types.ObjectId();
const userId2 = mongoose.Types.ObjectId();
const newDate = Date.now();

describe('test Tokens', () => {
    it('should return the doc with findById', () => {
      const _doc = {
        _id: '507f191e810c19729de860ea',
        userID: userId,
        token: crypto.randomBytes(32).toString('hex')
      };
  
      mockingoose(Token).toReturn(_doc, 'findOne');
  
      return Token.findById({ _id: '507f191e810c19729de860ea' }).then(doc => {
        expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
      });
    });

    it('should return the doc with update', () => {
        const _doc = {
            _id: '507f191e810c19729de860ea',
            userID: userId,
            token: crypto.randomBytes(32).toString('hex')
          };
        
        
        mockingoose(Token).toReturn(_doc, 'update');
    
        return Token.update({ userID: userId2 }) // this won't really change anything
          .where({ _id: '507f191e810c19729de860ea' })
          .then(doc => {
            expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
          });
      });

      it('should create the doc', () => {
        const _doc = {
            _id: '507f191e810c19729de860ea',
            userID: userId,
            token: crypto.randomBytes(32).toString('hex')
          };
        
        mockingoose(Token).toReturn(_doc, 'save');
    
        return Token.findById({ _id: '507f191e810c19729de860ea' }).then(doc => {
            expect(doc.userID).toMatchObject(_doc.userID);
          });
        });
      
    it('should delete a doc', () => {
        const _doc = {
            _id: '507f191e810c19729de860ea',
            userID: userId,
            token: crypto.randomBytes(32).toString('hex')
        };
            
        mockingoose(Token).toReturn(_doc, 'deleteOne');
        
        return Token.findByIdAndDelete({ _id: '507f191e810c19729de860ea' }).then(doc => {
            expect(doc).toBe(undefined);
        });
    });
      
      
      it('should reset model mock', () => {
        mockingoose(Token).toReturn({ userID: userId });
        mockingoose(Token).toReturn({ userID: userId2 }, 'save');
      
        mockingoose(Token).reset(); // will reset all operations;
      });
});


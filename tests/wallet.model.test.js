const mongoose = require('mongoose');
const mockingoose = require('mockingoose');
const Wallet = require("../models/wallet.model")
const crypto = require("crypto");
const randtoken1 = crypto.randomBytes(32).toString('hex')
const UserID1 = mongoose.Types.ObjectId();


describe('test Wallet', () => {
    it('should return the doc with findById', () => {
      const _doc = {
        _id: '507f191e810c19729de860ea',
        name: "wallet",
        transactions: [],
        createdBy: UserID1,
        sharedAccounts: [UserID1],
        viewAccounts: [UserID1],
        balance: 0,
        status: false,
        categories : []
      };
  
      mockingoose(Wallet).toReturn(_doc, 'findOne');
  
      return Wallet.findById({ _id: '507f191e810c19729de860ea' }).then(doc => {
        expect(JSON.parse(JSON.stringify(doc.name))).toEqual(_doc.name);
      });
    });

    it('should return the doc with update', () => {
        const _doc = {
            _id: '507f191e810c19729de860ea',
            name: "wallet",
            transactions: [],
            createdBy: UserID1,
            sharedAccounts: [UserID1],
            viewAccounts: [UserID1],
            balance: 0,
            status: false,
            categories : []
          };
        
        
        mockingoose(Wallet).toReturn(_doc, 'update');
    
        return Wallet.update({ name: "wallet2" }) // this won't really change anything
          .where({ _id: '507f191e810c19729de860ea' })
          .then(doc => {
            expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
          });
      });

      it('should create the doc', () => {
        const _doc = {
            _id: '507f191e810c19729de860ea',
            name: "wallet",
            transactions: [],
            createdBy: UserID1,
            sharedAccounts: [UserID1],
            viewAccounts: [UserID1],
            balance: 0,
            status: false,
            categories : []
          };
        
        mockingoose(Wallet).toReturn(_doc, 'save');
    
        return Wallet.findById({ _id: '507f191e810c19729de860ea' }).then(doc => {
            expect(doc.name).toEqual(_doc.name);
          });
        });
      
    it('should delete a doc', () => {
        const _doc = {
            _id: '507f191e810c19729de860ea',
            name: "wallet",
            transactions: [],
            createdBy: UserID1,
            sharedAccounts: [UserID1],
            viewAccounts: [UserID1],
            balance: 0,
            status: false,
            categories : []
          };
            
        mockingoose(Wallet).toReturn(_doc, 'deleteOne');
        
        return Wallet.findByIdAndDelete({ _id: '507f191e810c19729de860ea' }).then(doc => {
            expect(doc).toBe(undefined);
        });
    });
      
      
      it('should reset model mock', () => {
        mockingoose(Wallet).toReturn({ username: "wallet" });
        mockingoose(Wallet).toReturn({ username: "wallet2" }, 'save');
      
        mockingoose(Wallet).reset(); // will reset all operations;
      });
});
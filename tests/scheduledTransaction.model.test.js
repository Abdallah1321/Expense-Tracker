const mongoose = require('mongoose');
const mockingoose = require('mockingoose');
const scheduledTransaction = require("../models/scheduledTransaction.model")
const walletID1 = mongoose.Types.ObjectId();
const walletID2 = mongoose.Types.ObjectId();
const newDate = "1970-01-19T23:29:04.688Z";

describe('test scheduled Transaction', () => {
    it('should return the doc with findById', () => {
      const _doc = {
        _id: '507f191e810c19729de860ea',
        walletID: walletID1,
        value: 100,
        description: "test",
        type: "e",
        NextTransactionDate: newDate,
        Recurring: false
      };
  
      mockingoose(scheduledTransaction).toReturn(_doc, 'findOne');
  
      return scheduledTransaction.findById({ _id: '507f191e810c19729de860ea' }).then(doc => {
        expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
      });
    });

    it('should return the doc with update', () => {
        const _doc = {
            _id: '507f191e810c19729de860ea',
            walletID: walletID1,
            value: 100,
            description: "test",
            type: "e",
            NextTransactionDate: newDate,
            Recurring: false
          };
        
        
        mockingoose(scheduledTransaction).toReturn(_doc, 'update');
    
        return scheduledTransaction.update({ vaue: 99 }) // this won't really change anything
          .where({ _id: '507f191e810c19729de860ea' })
          .then(doc => {
            expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
          });
      });

      it('should create the doc', () => {
        const _doc = {
            _id: '507f191e810c19729de860ea',
            walletID: walletID1,
            value: 100,
            description: "test",
            type: "e",
            NextTransactionDate: newDate,
            Recurring: false
          };
        
        mockingoose(scheduledTransaction).toReturn(_doc, 'save');
    
        return scheduledTransaction.findById({ _id: '507f191e810c19729de860ea' }).then(doc => {
            expect(doc.walletID).toMatchObject(_doc.walletID);
          });
        });
      
    it('should delete a doc', () => {
        const _doc = {
            _id: '507f191e810c19729de860ea',
            walletID: walletID1,
            value: 100,
            description: "test",
            type: "e",
            NextTransactionDate: newDate,
            Recurring: false
          };
            
        mockingoose(scheduledTransaction).toReturn(_doc, 'deleteOne');
        
        return scheduledTransaction.findByIdAndDelete({ _id: '507f191e810c19729de860ea' }).then(doc => {
            expect(doc).toBe(undefined);
        });
    });
      
      
      it('should reset model mock', () => {
        mockingoose(scheduledTransaction).toReturn({ walletID: walletID1 });
        mockingoose(scheduledTransaction).toReturn({ walletID: walletID2 }, 'save');
      
        mockingoose(scheduledTransaction).reset(); // will reset all operations;
      });
});


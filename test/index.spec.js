import dbio from '../lib/index.js';
import { expect } from 'chai';

describe('dbio', function() {

  it('should be an object', function() {
    expect(dbio).to.be.a('object');
  })

  describe('#registerCollection', function() {

    const tableName = 'People';
    const key = 'people';
    const model = [
      {
        column: 'person_id',
        key: 'personId',
        type: 'INTEGER'
      },
      {
        column: 'first_name',
        key: 'firstName',
        type: 'TEXT'
      },
      {
        column: 'middle_name',
        key: 'middleName',
        type: 'TEXT'
      },
      {
        column: 'last_name',
        key: 'lastName',  
        type: 'TEXT'
      },
      {
        column: 'date_created',
        key: 'dateCreated',  
        type: 'TIMESTAMP'
      },
      // {
      //   key: 'emails',
      //   entity: 'email'
      // },
    ];

    afterEach(function(){
      delete dbio.people
    })

    it('should be a function', function() {
      expect(dbio.registerCollection).to.be.a('function');
    });

    it('should throw an error without a \'model\' argument', function() {
      expect(()=>dbio.registerCollection({ key, tableName })).to.throw(Error, "model is not defined");
    });

    it('should throw an error with a bad \'model\' argument', function() {
      expect(()=>dbio.registerCollection({ model: null, key, tableName })).to.throw(Error, "model is null");
    });

    it('should throw an error with a bad \'model\' argument', function() {
      expect(()=>dbio.registerCollection({ model: 123, key, tableName })).to.throw(Error, "model is not of type array");
    });

    it('should throw an error with a bad \'model\' argument', function() {
      expect(()=>dbio.registerCollection({ model: [null], key, tableName })).to.throw(Error, "prop is null");
    });

    it('should throw an error with a bad \'model\' argument', function() {
      expect(()=>dbio.registerCollection({ model: [{ key:null, column: 'name', type: 'TEXT' }], key, tableName })).to.throw(Error, "key is not of type string");
    });

    it('should throw an error with a bad \'model\' argument', function() {
      expect(()=>dbio.registerCollection({ model: [{ key:'', column: 'name', type: 'TEXT' }], key, tableName })).to.throw(Error, "key length is not atleast 1");
    });

    it('should throw an error with a bad \'model\' argument', function() {
      expect(()=>dbio.registerCollection({ model: [{ key:123, column: 'name', type: 'TEXT' }], key, tableName })).to.throw(Error, "key is not of type string");
    });

    it('should throw an error with a bad \'model\' argument', function() {
      expect(()=>dbio.registerCollection({ model: [{ key:'name', column: null, type: 'TEXT' }], key, tableName })).to.throw(Error, "column is not of type string");
    });

    it('should throw an error with a bad \'model\' argument', function() {
      expect(()=>dbio.registerCollection({ model: [{ key:'name', column: '', type: 'TEXT' }], key, tableName })).to.throw(Error, "column length is not atleast 1");
    });

    it('should throw an error with a bad \'model\' argument', function() {
      expect(()=>dbio.registerCollection({ model: [{ key:'name', column: 123, type: 'TEXT' }], key, tableName })).to.throw(Error, "column is not of type string");
    });

    it('should throw an error with a bad \'model\' argument', function() {
      expect(()=>dbio.registerCollection({ model: [{ key:'name', column: 'name', type: null }], key, tableName })).to.throw(Error, "type is not of type string");
    });

    it('should throw an error with a bad \'model\' argument', function() {
      expect(()=>dbio.registerCollection({ model: [{ key:'name', column: 'name', type: '' }], key, tableName })).to.throw(Error, "type is not an allowed value");
    });

    it('should throw an error with a bad \'model\' argument', function() {
      expect(()=>dbio.registerCollection({ model: [{ key:'name', column: 'name', type: 123 }], key, tableName })).to.throw(Error, "type is not of type string");
    });

    it('should throw an error with a bad \'model\' argument', function() {
      expect(()=>dbio.registerCollection({ model: [{ key:'name', column: 'name', type: 'asdf' }], key, tableName })).to.throw(Error, "type is not an allowed value");
    });

    it('should throw an error without a \'key\' argument', function() {
      expect(()=>dbio.registerCollection({ model, tableName })).to.throw(Error, "key is not defined");
    });

    it('should throw an error with an invalid \'key\' argument', function() {
      expect(()=>dbio.registerCollection({ key: null, model, tableName })).to.throw(Error, "key is null");
    });

    it('should throw an error with an invalid \'key\' argument', function() {
      expect(()=>dbio.registerCollection({ key: 123, model, tableName })).to.throw(Error, "key is not of type string");
    });

    it('should throw an error with an invalid \'key\' argument', function() {
      expect(()=>dbio.registerCollection({ key: '', model, tableName })).to.throw(Error, "key length is not atleast 1");
    });

    it('should throw an error without a \'tableName\' argument', function() {
      expect(()=>dbio.registerCollection({ key, model })).to.throw(Error, "tableName is not defined");
    });

    it('should throw an error with an invalid \'tableName\' argument', function() {
      expect(()=>dbio.registerCollection({ key, model, tableName: null })).to.throw(Error, "tableName is null");
    });

    it('should throw an error with an invalid \'tableName\' argument', function() {
      expect(()=>dbio.registerCollection({ key, model, tableName: 123 })).to.throw(Error, "tableName is not of type string");
    });

    it('should throw an error with an invalid \'tableName\' argument', function() {
      expect(()=>dbio.registerCollection({ key, model, tableName: '' })).to.throw(Error, "tableName length is not atleast 1");
    });
  })
  describe('#registerEntity', function() {
    it('should be a function', function() {
      expect(dbio.registerEntity).to.be.a('function');
    })
  })
})

// const person = [
//   {
//     column: 'person_id',
//     key: 'personId',
//     type: 'INTEGER'
//   },
//   {
//     column: 'first_name',
//     key: 'firstName',
//     type: 'TEXT'
//   },
//   {
//     column: 'middle_name',
//     key: 'middleName',
//     type: 'TEXT'
//   },
//   {
//     column: 'last_name',
//     key: 'lastName',  
//     type: 'TEXT'
//   },
//   {
//     column: 'date_created',
//     key: 'dateCreated',  
//     type: 'TIMESTAMP'
//   },
//   // {
//   //   key: 'emails',
//   //   entity: 'email'
//   // },
// ];

// const email = [
//   {
//     column: 'email_id',
//     key: 'emailId',
//     type: 'INTEGER'
//   },
//   {
//     column: 'email',
//     key: 'email',
//     type: 'STRING'
//   },
// ];

// dbio.registerQueryHandler(console.log);

// dbio.registerCollection({
//   model: person,
//   tableName: 'People',
//   key: 'people',
// });

// dbio.registerEntity({
//   model: person,
//   key: 'person',
//   actions: [
//     function introduceSelf() {
//       console.log(`Hello, my name is ${this.fullName}.`);
//     }
//   ],
//   getters: [
//     function fullName() {
//       let _fullName = '';
//       if (this.firstName)
//         _fullName += this.firstName + " ";
//       if (this.middleName)
//         _fullName += this.middleName[0] + ". ";
//       if (this.lastName)
//         _fullName += this.lastName;
//       return _fullName.trim();
//     }
//   ]
// });

// dbio.registerCollection({
//   model: email,
//   tableName: 'Emails',
//   key: 'emails',
// });

// dbio.registerEntity({
//   model: email,
//   key: 'email'
// });

// const brian = dbio.person({
//   personId: 1,
//   firstName: 'Brian',
//   middleName: 'Marian',
//   lastName: 'Kapustka',
// });
// brian.introduceSelf();

// dbio.people
// .select()
// .where({
//   email: {
//     like: {
//       or: ['brian','kupi']
//     }
//   }
// });
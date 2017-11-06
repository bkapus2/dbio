import dbio from '../lib/index.js';
import { expect } from 'chai';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

describe('dbio', function() {

  const tableName = 'People';
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

  it('should be an object', function() {
    expect(dbio).to.be.a('object');
  });

  describe('#registerCollection', function() {

    const key = 'people';

    const registerCollection = function(...args) {
      return function() {
        return dbio.registerCollection(...args)
      }
    }

    afterEach(function(){
      delete dbio[key]
    });

    it('should be a function', function() {
      expect(dbio.registerCollection).to.be.a('function');
    });

    it('should throw an error when given incorrect arguments', function() {
      expect(registerCollection({ key, tableName })).to.throw(Error, "model is not defined");
      expect(registerCollection({ model: null, key, tableName })).to.throw(Error, "model is null");
      expect(registerCollection({ model: 123, key, tableName })).to.throw(Error, "model is not of type array");
      expect(registerCollection({ model: [null], key, tableName })).to.throw(Error, "prop is null");
      expect(registerCollection({ model: [{ key: null, column: 'name', type: 'TEXT' }], key, tableName })).to.throw(Error, "key is not of type string");
      expect(registerCollection({ model: [{ key: '', column: 'name', type: 'TEXT' }], key, tableName })).to.throw(Error, "key length is not atleast 1");
      expect(registerCollection({ model: [{ key: 123, column: 'name', type: 'TEXT' }], key, tableName })).to.throw(Error, "key is not of type string");
      expect(registerCollection({ model: [{ key: 'name', column: null, type: 'TEXT' }], key, tableName })).to.throw(Error, "column is not of type string");
      expect(registerCollection({ model: [{ key: 'name', column: '', type: 'TEXT' }], key, tableName })).to.throw(Error, "column length is not atleast 1");
      expect(registerCollection({ model: [{ key: 'name', column: 123, type: 'TEXT' }], key, tableName })).to.throw(Error, "column is not of type string");
      expect(registerCollection({ model: [{ key: 'name', column: 'name', type: null }], key, tableName })).to.throw(Error, "type is not of type string");
      expect(registerCollection({ model: [{ key: 'name', column: 'name', type: '' }], key, tableName })).to.throw(Error, "type is not an allowed value");
      expect(registerCollection({ model: [{ key: 'name', column: 'name', type: 123 }], key, tableName })).to.throw(Error, "type is not of type string");
      expect(registerCollection({ model: [{ key: 'name', column: 'name', type: 'asdf' }], key, tableName })).to.throw(Error, "type is not an allowed value");
      expect(registerCollection({ model, tableName })).to.throw(Error, "key is not defined");
      expect(registerCollection({ key: null, model, tableName })).to.throw(Error, "key is null");
      expect(registerCollection({ key: 123, model, tableName })).to.throw(Error, "key is not of type string");
      expect(registerCollection({ key: '', model, tableName })).to.throw(Error, "key length is not atleast 1");
      expect(registerCollection({ key, model })).to.throw(Error, "tableName is not defined");
      expect(registerCollection({ key, model, tableName: null })).to.throw(Error, "tableName is null");
      expect(registerCollection({ key, model, tableName: 123 })).to.throw(Error, "tableName is not of type string");
      expect(registerCollection({ key, model, tableName: '' })).to.throw(Error, "tableName length is not atleast 1");
    });

    it('should register valid arguments without error', function() {
      const collection = dbio.registerCollection({ key, model, tableName });
      expect(collection).to.be.an.instanceof(Object);
    });

    it('should correctly register all properties', function() {
      const collection = dbio.registerCollection({ key, model, tableName });
      expect(collection.constructor.name).to.equal(tableName);
      expect(collection.model).to.equal(model);
      expect(dbio[key]).to.equal(collection);
    });
  });

  describe('#registerEntity', function() {
    
    const key = 'person';
    
    const registerEntity = function(...args) {
      return function() {
        return dbio.registerEntity(...args)
      }
    }

    afterEach(function(){
      delete dbio[key];
    })

    it('should be a function', function() {
      expect(dbio.registerEntity).to.be.a('function');
    });

    it('should throw an error when given incorrect arguments', function() {
      expect(registerEntity({ key })).to.throw(Error, "model is not defined");
      expect(registerEntity({ model: null, key })).to.throw(Error, "model is null");
      expect(registerEntity({ model: 123, key })).to.throw(Error, "model is not of type array");
      expect(registerEntity({ model: [null], key })).to.throw(Error, "prop is null");
      expect(registerEntity({ model: [{ key: null, column: 'name', type: 'TEXT' }], key })).to.throw(Error, "key is not of type string");
      expect(registerEntity({ model: [{ key: '', column: 'name', type: 'TEXT' }], key })).to.throw(Error, "key length is not atleast 1");
      expect(registerEntity({ model: [{ key: 123, column: 'name', type: 'TEXT' }], key })).to.throw(Error, "key is not of type string");
      expect(registerEntity({ model: [{ key: 'name', column: null, type: 'TEXT' }], key })).to.throw(Error, "column is not of type string");
      expect(registerEntity({ model: [{ key: 'name', column: '', type: 'TEXT' }], key })).to.throw(Error, "column length is not atleast 1");
      expect(registerEntity({ model: [{ key: 'name', column: 123, type: 'TEXT' }], key })).to.throw(Error, "column is not of type string");
      expect(registerEntity({ model: [{ key: 'name', column: 'name', type: null }], key })).to.throw(Error, "type is not of type string");
      expect(registerEntity({ model: [{ key: 'name', column: 'name', type: '' }], key })).to.throw(Error, "type is not an allowed value");
      expect(registerEntity({ model: [{ key: 'name', column: 'name', type: 123 }], key })).to.throw(Error, "type is not of type string");
      expect(registerEntity({ model: [{ key: 'name', column: 'name', type: 'asdf' }], key })).to.throw(Error, "type is not an allowed value");
      expect(registerEntity({ model })).to.throw(Error, "key is not defined");
      expect(registerEntity({ key: null, model })).to.throw(Error, "key is null");
      expect(registerEntity({ key: 123, model })).to.throw(Error, "key is not of type string");
      expect(registerEntity({ key: '', model })).to.throw(Error, "key length is not atleast 1");
    });

    it('should register valid arguments without error', function() {
      const factoryConstructor = dbio.registerEntity({ key, model, tableName });
      expect(factoryConstructor).to.be.an.instanceof(Function);
    });

    it('should correctly register all properties', function() {
    });
  });
});

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
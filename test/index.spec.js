import dbio from '../lib/index.js';
import { expect } from 'chai';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

const tableName = 'PeopleTable';
const masterModel = [
  {
    column: 'person_id',
    key: 'personId',
    type: 'INTEGER',
    value: 1
  },
  {
    column: 'first_name',
    key: 'firstName',
    type: 'TEXT',
    value: 'brian'
  },
  {
    column: 'middle_name',
    key: 'middleName',
    type: 'TEXT',
    value: 'marian'
  },
  {
    column: 'last_name',
    key: 'lastName',  
    type: 'TEXT',
    value: 'kapustka'
  },
  {
    column: 'date_created',
    key: 'dateCreated',  
    type: 'TIMESTAMP',
    value: new Date()
  },
  {
    column: 'is_programmer',
    key: 'isProgrammer',  
    type: 'BOOLEAN',
    value: true
  },
  // {
  //   key: 'emails',
  //   entity: 'email'
  // },
];
const props = function(props) {
  return function(item) {
    return props.reduce((acc, val)=>{
      acc[val] = item[val];
      return acc;
    },{});
  }
}
const model = masterModel.map(props(['column', 'key', 'type']));
const primativeInstance = masterModel.reduce((acc, {key, value})=>{acc[key] = value; return acc}, {});
const entityKey = 'person';
const collectionKey = 'people'

describe('dbio', function() {

  it('should be an object', function() {
    expect(dbio).to.be.a('object');
  });

  describe('#registerQueryHandler', function() {

    it('should be a function', function() {
      expect(dbio.registerQueryHandler).to.be.a('function');
    });
  });

  describe('#registerCollection', function() {

    const key = collectionKey;

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
      expect(registerCollection({ key, model, tableName })).to.not.throw(Error);
    });

    it('should correctly register all properties', function() {
      const collection = dbio.registerCollection({ key, model, tableName });
      expect(collection).to.be.an.instanceof(Object);
      expect(collection.constructor.name).to.equal(key[0].toUpperCase()+key.slice(1));
      expect(collection.model).to.equal(model);
      expect(dbio[key]).to.equal(collection);
    });
  });

  describe('#registerEntity', function() {
    
    const key = entityKey;
    
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
      expect(registerEntity({ key, model })).to.not.throw(Error);
    });

    it('should return a factory constructor which creates the expected entities', function() {
      const factoryConstructor = dbio.registerEntity({ key, model });
      expect(factoryConstructor).to.be.an.instanceof(Function);
      const instance = factoryConstructor(primativeInstance);
    });

    it('should correctly register all properties', function() {
      const factoryConstructor = dbio.registerEntity({ key, model });
      const instance = factoryConstructor();
      expect(instance.constructor.name).to.equal(key[0].toUpperCase()+key.slice(1));
      expect(instance.model).to.equal(model);
      expect(dbio[key]).to.equal(factoryConstructor);
    });
  });
});

describe('Entity', function() {

  const key = entityKey;
  const factoryConstructor = dbio.registerEntity({ key, model });
  const instance = factoryConstructor(primativeInstance);
  
  it('should return an object with the correct properties', function(){
    masterModel.forEach(({key}) => {
      expect(instance).to.have.property(key);
    });
  });

  it('should return an object with the correct property values', function(){
    masterModel.forEach(({key, value}) => {
      expect(instance[key]).to.equal(value);
    });
  });

  describe('#create', function(){

    it('should be a function', function() {
      expect(instance.create).to.be.instanceof(Function);
    });

    it('should return a promise', function() {
      expect(instance.create()).to.be.instanceof(Promise);
    });
  });

  describe('#read', function(){

    it('should be a function', function() {
      expect(instance.create).to.be.instanceof(Function);
    });

    it('should return a promise', function() {
      expect(instance.create()).to.be.instanceof(Promise);
    });
  });

  describe('#update', function(){

    it('should be a function', function() {
      expect(instance.create).to.be.instanceof(Function);
    });

    it('should return a promise', function() {
      expect(instance.create()).to.be.instanceof(Promise);
    });
  });

  describe('#delete', function(){

    it('should be a function', function() {
      expect(instance.create).to.be.instanceof(Function);
    });

    it('should return a promise', function() {
      expect(instance.create()).to.be.instanceof(Promise);
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
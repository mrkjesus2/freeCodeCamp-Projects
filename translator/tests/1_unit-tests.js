/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the test.skips in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

const { JSDOM } = require('jsdom');
let Translator;
let wrapReg = /<[\w\s="/]*>/g
let wrap1 = '<span class="highlight">'
let wrap2 = '</span>'

suite('Unit Tests', () => {
  suiteSetup(() => {
    // Mock the DOM for test.skiping and load Translator
    return JSDOM.fromFile('./views/index.html', {runScripts: 'dangerously'})
      .then((dom) => {
        global.window = dom.window;
        global.document = dom.window.document;

        Translator = require('../public/translator.js');
        console.log(Translator)
      });
  });

  suite('Function ____()', () => {
    suite('American to British English', () => {

      test.skip('Mangoes are my favorite fruit. --> Mangoes are my favourite fruit.', done => {
        const input = 'Mangoes are my favorite fruit.';
        const output = 'Mangoes are my favourite fruit.';
        assert.equal(Translator.toBritish(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip('I ate yogurt for breakfast. --> I ate yoghurt for breakfast.', done => {
        const input = 'I ate yogurt for breakfast.';
        const output = 'I ate yoghurt for breakfast.';

        assert.equal(Translator.toBritish(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip("We had a party at my friend's condo. --> We had a party at my friend's flat.", done => {
        const input = "We had a party at my friend's condo.";
        const output = "We had a party at my friend's flat.";

        assert.equal(Translator.toBritish(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip('Can you toss this in the trashcan for me? --> Can you toss this in the bin for me?', done => {
        const input = 'Can you toss this in the trashcan for me?';
        const output = 'Can you toss this in the bin for me?';

        assert.equal(Translator.toBritish(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip('The parking lot was full. --> The car park was full.', done => {
        const input = 'The parking lot was full.';
        const output = 'The car park was full.';

        assert.equal(Translator.toBritish(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip('Like a high tech Rube Goldberg machine. --> Like a high tech Heath Robinson device.', done => {
        const input = 'Like a high tech Rube Goldberg machine.';
        const output = 'Like a high tech Heath Robinson device.';

        assert.equal(Translator.toBritish(input).replace(wrapReg, ''), output)
        done();
      });
      
      test.skip('To play hooky means to skip class or work. --> To bunk off means to skip class or work.', done => {
        const input = 'To play hooky means to skip class or work.';
        const output = 'To bunk off means to skip class or work.';

        assert.equal(Translator.toBritish(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip('No Mr. Bond, I expect you to die. --> No Mr Bond, I expect you to die. ', done => {
        const input = 'No Mr. Bond, I expect you to die.';
        const output = 'No Mr Bond, I expect you to die.';

        assert.equal(Translator.toBritish(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip('Dr. Grosh will see you now. --> Dr Grosh will see you now. ', done => {
        const input = 'Dr. Grosh will see you now.';
        const output = 'Dr Grosh will see you now.';

        assert.equal(Translator.toBritish(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip('Lunch is at 12:15 today. --> Lunch is at 12.15 today.', done => {
        const input = 'Lunch is at 12:15 today.';
        const output = 'Lunch is at 12.15 today.';
        
        assert.equal(Translator.toBritish(input).replace(wrapReg, ''), output)
        done();
      });

    });

    suite('British to American English', () => {

      test.skip('We watched the footie match for a while. --> We watched the soccer match for a while.', done => {
        const input = 'We watched the footie match for a while.';
        const output = 'We watched the soccer match for a while.';

        assert.equal(Translator.toAmerican(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip('Paracetamol takes up to an hour to work. --> Tylenol takes up to an hour to work.', done => {
        const input = 'Paracetamol takes up to an hour to work.';
        const output = 'Tylenol takes up to an hour to work.';

        assert.equal(Translator.toAmerican(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip('First, caramelise the onions. --> First, caramelize the onions.', done => {
        const input = 'First, caramelise the onions.';
        const output = 'First, caramelize the onions.';

        assert.equal(Translator.toAmerican(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip('I spent the bank holiday at the funfair. --> I spent the public holiday at the carnival.', done => {
        const input = 'I spent the bank holiday at the funfair.';
        const output = 'I spent the public holiday at the carnival.';

        assert.equal(Translator.toAmerican(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip('I had a bicky then went to the chippy. --> I had a cookie then went to the fish-and-chip shop.', done => {
        const input = 'I had a bicky then went to the chippy.';
        const output = 'I had a cookie then went to the fish-and-chip shop.';

        assert.equal(Translator.toAmerican(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip("I've just got bits and bobs in my bum bag. --> I've just got odds and ends in my fanny pack.", done => {
        const input = "I've just got bits and bobs in my bum bag.";
        const output = "I've just got odds and ends in my fanny pack.";

        assert.equal(Translator.toAmerican(input).replace(wrapReg, ''), output)
        done();
      });
      
      test.skip("The car boot sale at Boxted Airfield was called off. --> The swap meet at Boxted Airfield was called off.", done => {
        const input = "The car boot sale at Boxted Airfield was called off.";
        const output = "The swap meet at Boxted Airfield was called off.";

        assert.equal(Translator.toAmerican(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip("Have you met Mrs Kalyani? --> Have you met Mrs. Kalyani?", done => {
        const input = "Have you met Mrs Kalyani?";
        const output = "Have you met Mrs. Kalyani?";

        assert.equal(Translator.toAmerican(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip("Prof Joyner of King's College, London. --> Prof. Joyner of King's College, London.", done => {
        const input = "Prof Joyner of King's College, London.";
        const output = "Prof. Joyner of King's College, London.";

        assert.equal(Translator.toAmerican(input).replace(wrapReg, ''), output)
        done();
      });

      test.skip('Tea time is usually around 4 or 4.30. --> Tea time is usually around 4 or 4:30.', done => {
        const input = 'Tea time is usually around 4 or 4.30.';
        const output = 'Tea time is usually around 4 or 4:30.';

        assert.equal(Translator.toAmerican(input).replace(wrapReg, ''), output)
        done();
      });

    });

  });

});

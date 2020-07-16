/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

let Translator;
let wrapReg = /<[\w\s="/]*>/g

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load translator then run tests
    Translator = require('../public/translator.js');
  });

  suite('Function displayTranslation()', () => {
    /* 
      The translated sentence is appended to the `translated-sentence` `div`
      and the translated words or terms are wrapped in 
      `<span class="highlight">...</span>` tags when the "Translate" button is pressed.
    */
    test("Translation appended to the `translated-sentence` `div`", done => {
      const text = document.getElementById('text-input');
      const sent = document.getElementById('translated-sentence');
      const output = 'What is your favourite colour';

      text.value = "What is your favorite color";
      Translator.lang = 'american-to-british'
      Translator.showTranslation(text.value);

      assert.strictEqual(sent.innerHTML.replace(wrapReg, ''), output);
      done();
    });

    /* 
      If there are no words or terms that need to be translated,
      the message 'Everything looks good to me!' is appended to the
      `translated-sentence` `div` when the "Translate" button is pressed.
    */
    test("'Everything looks good to me!' message appended to the `translated-sentence` `div`", done => {
      const text = document.getElementById('text-input');
      text.value = "I saw a mum pushing a pram.";
      const sent = document.getElementById('translated-sentence');
      const output = 'Everything looks good to me!';

      Translator.lang = 'american-to-british'
      Translator.showTranslation(text.value);

      assert.strictEqual(sent.textContent, output);
      done();
    });

    /* 
      If the text area is empty when the "Translation" button is
      pressed, append the message 'Error: No text to translate.' to 
      the `error-msg` `div`.
    */
    test("'Error: No text to translate.' message appended to the `translated-sentence` `div`", done => {
      const text = document.getElementById('text-input');
      text.value = "";
      const error = document.getElementById('error-msg');
      const output = 'Error: No text to translate.';

      Translator.lang = 'american-to-british'
      Translator.showTranslation(text.value);

      assert.strictEqual(error.textContent.replace(wrapReg, ''), output);
      done();
    });

  });

  suite('Function clearAll()', () => {
    /* 
      The text area and both the `translated-sentence` and `error-msg`
      `divs` are cleared when the "Clear" button is pressed.
    */
    test("Text area, `translated-sentence`, and `error-msg` are cleared", done => {
      const text = document.getElementById('text-input');
      const sentence = document.getElementById('translated-sentence');
      const error = document.getElementById('error-msg');

      // Simulate translation
      text.value = "biro";
      sentence.textContent = "ballpoint pen";
      
      error.textContent = 'Error: No text to translate.';

      Translator.clearInput();

      assert.strictEqual(text.value, '');
      assert.strictEqual(sentence.textContent, '');
      assert.strictEqual(error.textContent, '');
      done();
    });

  });

});

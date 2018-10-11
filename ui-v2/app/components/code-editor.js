import Component from '@ember/component';
import { get, set } from '@ember/object';
import qsaFactory from 'consul-ui/utils/qsa-factory';
const $$ = qsaFactory();
export default Component.extend({
  classNames: ['code-editor'],
  onchange: function(value) {
    set(this, 'mode', value);
    this.setMode(value);
  },
  onkeyup: function() {},
  init: function() {
    this._super(...arguments);
    const modes = [
      {
        name: 'JSON',
        mime: 'application/json',
        mode: 'javascript',
        ext: ['json', 'map'],
        alias: ['json5'],
      },
      { name: 'YAML', mime: 'text/x-yaml', mode: 'yaml', ext: ['yaml', 'yml'], alias: ['yml'] },
      {
        name: 'Plain Text',
        mime: 'text/plain',
        mode: 'null',
        ext: ['txt', 'text', 'conf', 'def', 'list', 'log'],
      },
    ];
    set(this, 'modes', modes);
    set(this, 'mode', modes[0]);
    set(this, 'options', {
      tabSize: 2,
      lineNumbers: true,
      mode: get(this, 'mode.mime'),
      theme: 'hashi',
      showCursorWhenSelecting: true,
      gutters: ['CodeMirror-lint-markers'],
      lint: true,
    });
    set(this, 'mode', get(this, 'modes.firstObject'));
    set(this, 'options', {
      tabSize: 2,
      lineNumbers: true,
      mode: get(this, 'mode.mime'),
      theme: 'hashi',
      showCursorWhenSelecting: true,
      gutters: ['CodeMirror-lint-markers'],
      lint: true,
    });
  },
  setMode: function(mode) {
    const editor = get(this, 'editor');
    editor.setOption('mode', mode.mime);
    // CodeMirror doesn't seem to have anyway to hook into whether a mode
    // has already loaded, or when a mode has finished loading
    // follow more or less what CodeMirror does but doesn't expose
    // see codemirror/addon/mode/loadmode.js
    let scripts = [...document.getElementsByTagName('script')];
    const loaded = scripts.find(function(item) {
      return item.src.indexOf(`/codemirror/mode/${mode.mode}/${mode.mode}.js`) !== -1;
    });
    CodeMirror.autoLoadMode(editor, mode.mode);
    if (loaded) {
      editor.performLint();
    } else {
      scripts = [...document.getElementsByTagName('script')];
      CodeMirror.on(scripts[0], 'load', function() {
        editor.performLint();
      });
    }
  },
  didInsertElement: function() {
    set(this, 'editor', [...$$('textarea + div', this.element)][0].CodeMirror);
    this.setMode(get(this, 'mode'));
  },
});

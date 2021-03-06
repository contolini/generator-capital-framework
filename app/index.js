'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var path = require('path');

// Eventually we'll generate this list dynamically from GitHub.
var frameworkComponents = [
  { name: 'Core', value: 'cf-core' },
  { name: 'Buttons', value: 'cf-buttons' },
  { name: 'Expandables', value: 'cf-expandables' },
  { name: 'Forms', value: 'cf-forms' },
  { name: 'Grid', value: 'cf-grid' },
  { name: 'Icons', value: 'cf-icons' },
  { name: 'Pagination', value: 'cf-pagination' }
];

var CapitalFrameworkGenerator = yeoman.generators.Base.extend({

  initializing: {

    greet: function() {
      this.pkg = require('../package.json');
      this.log( yosay('Welcome to Capital Framework\'s generator!') );
      this.log('To learn about Capital Framework, visit http://capitalframework.com');
    }

  },

  prompting: {

    askForName: function() {
      var done = this.async();
      this.prompt({
        name: 'name',
        message: 'What is the name of your project?',
        default: this._.humanize( path.basename(process.cwd()) ),
      }, function( answers ) {
        this.slugname = this._.slugify( answers.name );
        this.safeSlugname = this.slugname.replace( /-+([a-zA-Z0-9])/g, function ( g ) {
            return ' ' + g[1].toUpperCase();
          }
        );
        done();
      }.bind(this));
    },

    askForDescription: function() {
      var done = this.async();
      var prompts = [{
        name: 'description',
        message: 'Description',
        default: 'The best website ever.'
      }, {
        name: 'homepage',
        message: 'Project\'s homepage'
      }, {
        name: 'license',
        message: 'Project\'s License',
        default: 'MIT'
      }, {
        name: 'authorName',
        message: 'Author\'s name'
      }, {
        name: 'authorEmail',
        message: 'Author\'s email'
      }, {
        name: 'authorUrl',
        message: 'Author\'s homepage'
      }];
      this.prompt(prompts, function ( answers ) {
        this.currentYear = (new Date()).getFullYear();
        this.props = answers;
        done();
      }.bind(this));
    },

    askAboutComponents: function() {
      var done = this.async();
      this.prompt({
        type: 'checkbox',
        name: 'components',
        message: 'Which CF components would you like in your app?',
        choices: frameworkComponents
      }, function ( answers ) {
        this.components = answers.components;
        done();
      }.bind(this));
    }

  },

  writing: {

    appFiles: function() {
      this.template('_README.md', 'README.md');
      this.template('_Gruntfile.js', 'Gruntfile.js');
      this.template('_package.json', 'package.json');
      this.template('_bower.json', 'bower.json');
      this.copy('bowerrc', '.bowerrc');
      this.copy('gitignore', '.gitignore');
    },

    srcFiles: function() {
      this.mkdir('src');
      this.directory('src/static', 'src/static');
      this.mkdir('dist');
    },

  },

  install: function() {

    if ( this.options['skip-install'] ) return;

    var done = this.async(),
        actuallyDone = this._.after(2, done),
        components = this.components.map( function( component ) {
          return 'cfpb/' + component;
        });
    this.npmInstall( '', {}, actuallyDone );
    this.bowerInstall( components, {'save': true}, actuallyDone );

  },

  end: {

    bye: function(){
      this.log( yosay('All done! Happy hacking!') );
    }

  }


});

module.exports = CapitalFrameworkGenerator;
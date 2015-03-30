import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('polar-clock');
  this.route('bar-chart');
  this.route('seahawks');
  this.route('pie-chart');
});

export default Router;

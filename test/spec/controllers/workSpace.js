'use strict';

describe('Controller: workSpace', function () {

  // load the controller's module
  beforeEach(module('myBuilderApp'));

  var workSpace,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
      workSpace = $controller('workSpace', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(workSpace.awesomeThings.length).toBe(3);
  });
});

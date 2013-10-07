/*globals describe, beforeEach, it*/
var testUtils = require('./testUtils'),
    should = require('should'),
    sinon = require('sinon'),
    when = require('when'),
    _ = require("underscore"),
    errors = require('../../server/errorHandling'),

    // Stuff we are testing
    knex = require("../../server/models/base").Knex,
    migration = require('../../server/data/migration'),
    exporter = require('../../server/data/export'),
    importer = require('../../server/data/import'),
    Importer000 = require('../../server/data/import/000'),
    fixtures = require('../../server/data/fixtures'),
    Settings = require('../../server/models/settings').Settings;

describe("Import", function () {

    should.exist(exporter);
    should.exist(importer);

    beforeEach(function (done) {
        // clear database... we need to initialise it manually for each test
        testUtils.clearData().then(function () {
            done();
        }, done);
    });

    it("resolves 000", function (done) {
        var importStub = sinon.stub(Importer000, "importData", function () {
                return when.resolve();
            }),
            fakeData = { test: true };

        importer("000", fakeData).then(function () {
            importStub.calledWith(fakeData).should.equal(true);

            importStub.restore();

            done();
        }).then(null, done);
    });

    describe("000", function () {
        this.timeout(4000);

        should.exist(Importer000);

        it("imports data from 000", function (done) {
            var exportData;

            // initialise database to version 000 - confusingly we have to set the max version to be one higher
            // than the migration version we want. Could just use migrate from fresh here... but this is more explicit
            migration.migrateUpFromVersion('000', '001').then(function () {
                // Load the fixtures
                return fixtures.populateFixtures();
            }).then(function () {
                // Initialise the default settings
                return Settings.populateDefaults();
            }).then(function () {
                // export the version 000 data ready to import
                // TODO: Should have static test data here?
                return exporter();
            }).then(function (exported) {
                exportData = exported;

                return importer("000", exportData);
            }).then(function () {
                // Grab the data from tables
                return when.all([
                    knex("users").select(),
                    knex("posts").select(),
                    knex("settings").select(),
                    knex("tags").select()
                ]);
            }).then(function (importedData) {

                should.exist(importedData);
                importedData.length.should.equal(4, 'Did not get data successfully');

                // we always have 0 users as there isn't one in fixtures
                importedData[0].length.should.equal(0, 'There should not be a user');
                // import no longer requires all data to be dropped, and adds posts
                importedData[1].length.should.equal(exportData.data.posts.length + 1, 'Wrong number of posts');

                // test settings
                importedData[2].length.should.be.above(0, 'Wrong number of settings');
                _.findWhere(importedData[2], {key: "databaseVersion"}).value.should.equal("000", 'Wrong database version');

                // test tags
                importedData[3].length.should.equal(exportData.data.tags.length, 'no new tags');

                done();
            }).then(null, done);
        });
    });
});

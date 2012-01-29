var courseData = [{
  id: "5",
  permalink: "contributing-open-source",
  updates: null,
  name: "Contributing to Open Source",
  price: "100",
  "min-learners": "2",
  "max-learners": "12",
  "decision-date": "1330560000",
  "start-date": "1330560000",
  "end-date": "1333062000",
  location: "Dublin",
  summary: "A course to learn how to contribute to open source",
  description: "During the course you will contribute to iPull so that you learn the basics of an open source project!",
  "creator-id": "1",
  "updater-id": null
}];


describe("Course", function () {

    beforeEach(function () {
        this.course = new Course(courseData[0]);
    });

    it("creates course from data", function () {
        expect(this.course.get('permalink')).toEqual("contributing-open-source");
    });

});

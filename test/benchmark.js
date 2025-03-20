import Benchmark from "benchmark";
import { ulid } from "../dist/node/index.js";

const suite = new Benchmark.Suite();

// add tests
suite.add("Simple ulid", function () {
    ulid();
});
suite.add("ulid with timestamp", function () {
    ulid(Date.now());
});

// add listeners
suite.on("cycle", function (event) {
    console.log(String(event.target));
});
suite.on("complete", function () {
    console.log("Done!");
});

// run async
suite.run({ async: true });

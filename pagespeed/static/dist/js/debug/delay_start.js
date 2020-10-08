function delay(ms) {
  console.log("delay start")
  var start = Date.now(),
    now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}
delay(5000)
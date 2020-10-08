    let results = {};
    var performance_observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        // Display each reported measurement on console
        console.log(entry)
        results[entry.name] = {
          "start": entry.startTime,
          "duration": entry.duration
        }
        console.table(results)
      })
    });
    performance_observer.observe({entryTypes: ['frame', 'navigation', 'resource', 'mark', 'measure']});
    performance.mark('registered-observer');
    function clicked(elem) {
      console.log("Clicked")
      performance.mark('click-function-start');
      // This function takes 3 seconds to run
      performance.mark('click-function-end');
      performance.measure('delay', 'click-function-start', 'click-function-end');
    }
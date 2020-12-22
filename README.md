# Scheduler (pseudo-gantt) using D3

Generates a gant chart to which one can events and restrictions.


Use case:

```javascript
window.onload = function () {
	var params = { 
		width: 799,
		height: 222,
		start: new Date(2011, 2, 10),
		end: new Date(2011, 2, 20),
		container: "schedule",
		mode: true
	}
	var schedule = new Schedule(params);
	schedule.draw();
}
```
this is a test

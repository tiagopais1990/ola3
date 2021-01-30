const currentIssues = [];
const octoprintLogs = [];

class PrinterTicker {
  static async addOctoPrintLog(printer, message, state, plugin) {
    let id = null;
    if (octoprintLogs.length === 0) {
      //first issue
      id = 0;
    } else {
      id = octoprintLogs[octoprintLogs.length - 1].id + 1;
    }
    const newLog = {
      id: id,
      date: new Date(),
      message: message,
      printerID: printer._id,
      printer: printer.printerURL,
      state: state,
      pluginDisplay: plugin,
    };
    octoprintLogs.push(newLog);
    if (octoprintLogs.length >= 10000) {
      octoprintLogs.shift();
    }
  }

  static async addIssue(date, printer, message, state, printerID) {
    let id = null;
    if (currentIssues.length === 0) {
      //first issue
      id = 0;
    } else {
      id = currentIssues[currentIssues.length - 1].id + 1;
    }
    const newIssue = {
      id: id,
      date: date,
      message: message,
      printerID: printerID,
      printer: printer,
      state: state,
    };
    currentIssues.push(newIssue);
    if (currentIssues.length >= 10000) {
      currentIssues.shift();
    }
  }
  static async removeIssue(id) {
    const index = _.findIndex(currentIssues, function (o) {
      return o.id == id;
    });
    currentIssues.splice(index, 1);
  }
  static async returnOctoPrintLogs() {
    return octoprintLogs;
  }
  static async returnIssue() {
    return currentIssues;
  }
}

module.exports = {
  PrinterTicker,
};

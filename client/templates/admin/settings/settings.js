Template.adminSettings.events({
  'click [data-action=awardLeaders]': function(){
    var user = Meteor.userId()
    if(confirm("Are you sure?")) {
        Meteor.call('awardLeaders', user)
    }
  },
  'click [data-action=flushQuestions]': function(){
    if(confirm("Are you sure?")) {
       Meteor.call('flushQuestions')
    }
  },
  'click [data-action=loop]': function () {
    // Set area, yards, down, style to 1
    var area = 1
    var maxArea = 6
    var yards = 1
    var maxYards = 6
    var down = 1
    var maxDown = 6
    var style = 1
    var maxStyle = 3

    function multiplier(titles, m1a, m1b, m2a, m2b, m3a, m3b, m4a, m4b, m5a, m5b, m6a, m6b){
      var options = {
        option1: {title: titles[0], low: m1a, high: m1b},
        option2: {title: titles[1], low: m2a, high: m2b},
        option3: {title: titles[2], low: m3a, high: m3b},
        option4: {title: titles[3], low: m4a, high: m4b},
        option5: {title: titles[4], low: m5a, high: m5b},
        option6: {title: titles[5], low: m6a, high: m6b},
      }
      return options
    }

    var multipliers = function (down, yards, area, style, titles) {
      if (down === 1) {
        var titles = ["Run", "Pass", "Interception", "Pick Six", "Fumble", "Touchdown"]
      } else if (down === 2) {
        var titles = ["Run", "Pass", "Turnover", "Touchdown"]
      } else if (down === 3 && area === 6) {
        var titles = ["Run", "Pass", "Pick Six", "Interception", "Fumble", "Touchdown"]
      } else if (down === 3) {
        var titles = ["Unable to Covert First Down", "Convert to First Down", "Pick Six", "Interception", "Fumble", "Touchdown"]
      } else if (down === 4 && style === 3 && area === 6) {
        var titles = ["Run", "Pass", "Pick Six", "Interception", "Fumble", "Touchdown"]
      } else if (down === 4 && style === 3) {
        var titles = ["Unable to Covert First Down", "Convert to First Down", "Pick Six", "Interception", "Fumble", "Touchdown"]
      } else if (down === 4 && area >= 4 ) {
        var titles = ["Kick Good!", "Run", "Pass", "Fumble", "Missed Kick", "Blocked Kick"]
      } else if (down === 4) {
        var titles = ["Fair Catch/No Return", "Neg to 20 Yard Return", "21-40 Yard Return", "Blocked Punt", "Fumble", "Touchdown"]
      } else if (down === 5) {
        var titles = ["Kick Good!", "Fake Kick No Score", "Blocked Kick", "Missed Kick", "Two Point Good", "Two Point No Good"]
      } else if (down === 6 && style === 3)  {
        var titles = ["Touchback/No Return", "Neg to 25 Yard Return",  "26+ Return", "Failed Onside", "Successful Onside", "Touchdown"]
      } else if (down === 6)  {
        var titles = ["Touchback/No Return", "Neg to 25 Yard Return",  "26-45 Return", "46+", "Fumble", "Touchdown"]
      }

      if (down === 1) {
        // Inches
        if(yards == 1){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 2.42,
              3.2, 4.81,
              (3.2 * 2), (4.81 * 2),
              2.2, 4.81,
              15.9, 21.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.02,
              2.2, 4.81,
              (2.2 * 2), (4.81 * 2),
              2.2, 4.81,
              11.9, 18.61)
          } else if (area == 3 || area == 4){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              2.2, 4.81,
              (4.2 * 2), (8.81 * 2),
              2.2, 4.81,
              4.9, 7.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              2.2, 4.81,
              (4.2 * 2), (8.81 * 2),
              2.2, 4.81,
              2.9, 3.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.42,
              2.2, 3.81,
              (8.2 * 2), (10.81 * 2),
              2.2, 4.81,
              1.9, 2.61)
          }
        }

        // 1-2 Yards
        else if (yards == 2){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 2.42,
              3.2, 4.81,
              (3.2 * 2), (4.81 * 2),
              2.2, 4.81,
              12.9, 23.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.02,
              2.2, 4.81,
              (8.2 * 2), (10.81 * 2),
              2.2, 4.81,
              16.9, 18.61)
          } else if (area == 3 || area == 4){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              2.2, 4.81,
              (10.2 * 2), (14.81 * 2),
              2.2, 4.81,
              8.9, 12.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              2.2, 4.81,
              (12.2 * 2), (16.81 * 2),
              2.2, 4.81,
              2.9, 3.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.42,
              2.2, 3.81,
              (12.2 * 2), (23.81 * 2),
              2.2, 4.81,
              1.9, 2.61)
          }
        }

        // 3-5 Yards
        else if (yards == 3){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 2.42,
              3.2, 4.81,
              (3.2 * 2), (4.81 * 2),
              2.2, 4.81,
              13.9, 15.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.02,
              2.2, 4.81,
              (5.2 * 2), (6.81 * 2),
              2.2, 4.81,
              10.9, 13.61)
          } else if (area == 3 || area == 4){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              2.2, 4.81,
              (6.2 * 2), (7.81 * 2),
              2.2, 4.81,
              4.9, 7.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              2.2, 4.81,
              (8.2 * 2), (10.81 * 2),
              2.2, 4.81,
              2.9, 3.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.42,
              2.2, 3.81,
              (12.2 * 2), (14.81 * 2),
              2.2, 4.81,
              1.9, 2.61)
          }
        }

        // 6-9 Yards
        else if (yards == 4){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
             1.5, 1.7,
             1.6, 2.42,
             3.2, 4.81,
             (2.9 * 2), (3.61 * 2),
             2.9, 3.61,
             14.9, 18.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.02,
              2.2, 4.81,
              (4.2 * 2), (4.81 * 2),
              2.2, 4.81,
              12.9, 15.61)
          } else if (area == 3 || area == 4){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              2.2, 4.81,
              (6.2 * 2), (8.81 * 2),
              2.2, 4.81,
              4.9, 7.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
             1.6, 1.92,
             2.2, 4.81,
             (12.9 * 2), (14.61 * 2),
             2.9, 4.61,
             2.9, 3.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 1.9,
             1.6, 2.42,
             2.2, 3.81,
             (13.9 * 2), (15.61 * 2),
             3.9, 5.61,
             1.9, 2.61)
          }
        }

        // 10-15 Yards
        else if (yards == 5){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 2.42,
              3.2, 4.81,
              (2.9 * 2), (3.61 * 2),
              2.9, 3.61,
              12.9, 13.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.02,
              2.2, 4.81,
              (2.2 * 2), (5.81 * 2),
              2.2, 4.81,
              8.9, 12.61)
          } else if (area == 3 || area == 4){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              2.2, 4.81,
              (5.2 * 2), (8.81 * 2),
              2.2, 4.81,
              4.9, 7.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              2.2, 4.81,
              (8.9 * 2), (11.61 * 2),
              2.9, 4.61,
              2.9, 3.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.42,
              2.2, 3.81,
              (13.9 * 2), (15.61 * 2),
              3.9, 5.61,
              1.9, 2.61)
          }
        }

        // 15+ Yards
        else if (yards == 6){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 2.42,
              3.2, 4.81,
              (2.9 * 2), (3.61 * 2),
              2.9, 3.61,
              12.9, 23.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.02,
              2.2, 4.81,
              (2.2 * 2), (4.81 * 2),
              2.2, 4.81,
              9.9, 13.61)
          } else if (area == 3 || area == 4){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              2.2, 4.81,
              (5.2 * 2), (6.81 * 2),
              2.2, 4.81,
              4.9, 9.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              2.2, 4.81,
              (8.9 * 2), (13.61 * 2),
              2.9, 4.61,
              2.9, 4.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.42,
              2.2, 3.81,
              (13.9 * 2), (15.61 * 2),
              3.9, 5.61,
              1.9, 2.61)
          }
        }
      }

      // Second Down
      else if(down == 2){

        if(yards == 1){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 2.42,
              4.2, 6.81,
              15.9, 21.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.02,
              4.2, 6.81,
              11.9, 18.61)
          } else if (area == 3 || area == 4){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              4.2, 6.81,
              4.9, 7.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              4.2, 6.81,
              3.9, 4.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.42,
              4.2, 6.81,
              1.9, 2.61)
          }
        }

        // 1-2 Yards
        else if (yards == 2){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 2.42,
              4.2, 6.81,
              12.9, 23.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.02,
              4.2, 6.81,
              16.9, 18.61)
          } else if (area == 3 || area == 4){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              4.2, 6.81,
              8.9, 12.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              4.2, 6.81,
              4.9, 5.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.42,
              4.2, 6.81,
              1.9, 2.61)
          }
        }

        // 3-5 Yards
        else if (yards == 3){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 2.42,
              4.2, 6.81,
              13.9, 15.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.02,
              4.2, 6.81,
              10.9, 13.61)
          } else if (area == 3 || area == 4){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              4.2, 6.81,
              4.9, 7.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              4.2, 6.81,
              2.9, 3.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.42,
              4.2, 6.81,
              1.9, 2.61)
          }
        }

        // 6-9 Yards
        else if (yards == 4){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
             1.5, 1.7,
             1.6, 2.42,
             4.2, 6.81,
             14.9, 18.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.02,
              4.2, 6.81,
              12.9, 15.61)
          } else if (area == 3 || area == 4){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              4.2, 6.81,
              4.9, 7.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              4.2, 6.81,
              2.9, 3.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.42,
              4.2, 6.81,
              1.9, 2.61)
          }
        }

        // 10-15 Yards
        else if (yards == 5){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 2.42,
              4.2, 6.81,
              12.9, 13.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.02,
              4.2, 6.81,
              8.9, 12.61)
          } else if (area == 3 || area == 4){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              4.2, 6.81,
              4.9, 7.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              4.2, 6.81,
              2.9, 3.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.42,
              4.2, 6.81,
              1.9, 2.61)
          }
        }

        // 15+ Yards
        else if (yards == 6){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 2.42,
              4.2, 6.81,
              12.9, 23.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.02,
              4.2, 6.81,
              9.9, 13.61)
          } else if (area == 3 || area == 4){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              4.2, 6.81,
              4.9, 9.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.5, 1.7,
              1.6, 1.92,
              4.2, 6.81,
              2.9, 4.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 1.9,
              1.6, 2.42,
              4.2, 6.81,
              1.9, 2.61)
          }
        }
      }
      // "Run", "Pass", "Pick Six", "Interception", "Fumble", "Touchdown"
      else if(down == 3 && area == 6){
        return multiplier(
          titles,
          1.7, 2.6,
          1.8, 2.82,
          (5.9 * 2), (8.61 * 2),
          5.9, 8.61,
          3.2, 4.81,
          2.9, 4.61)
      }

      // Third Down
      else if(down == 3){

        // Inches
        if(yards == 1){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (5.9 * 2), (8.61 * 2),
              5.9, 8.61,
              2.2, 4.81,
              15.9, 23.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (4.2 * 2), (7.81 * 2),
              4.2, 7.81,
              2.2, 4.81,
              10.9, 12.61)
          } else if (area == 3 || area == 4){
            // Mot of the field
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (4.2 * 2), (7.81 * 2),
              4.2, 7.81,
              2.2, 4.81,
              6.9, 9.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (6.9 * 2), (9.61 * 2),
              5.9, 7.61,
              2.2, 4.81,
              2.9, 3.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
            1.7, 2.6,
            1.8, 2.82,
            (5.9 * 2), (8.61 * 2),
            5.9, 8.61,
            3.2, 4.81,
            2.9, 4.61)
          }
        }

        // 1-2 Yards
        else if (yards == 2){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.7, 2.6,
              2.3, 3.82,
              (3.9 * 2), (6.61 * 2),
              5.9, 8.61,
              2.2, 4.81,
              11.9, 13.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (4.2 * 2), (7.81 * 2),
              4.2, 7.81,
              2.2, 4.81,
              9.9, 10.61)
          } else if (area == 3 || area == 4){
            // Mot of the field
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (4.2 * 2), (7.81 * 2),
              4.2, 7.81,
              2.2, 4.81,
              6.9, 9.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (6.9 * 2), (9.61 * 2),
              5.9, 7.61,
              2.2, 4.81,
              2.9, 3.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 2.6,
              1.9, 2.82,
              (7.9 * 2), (10.61 * 2),
              3.9, 5.61,
              2.2, 4.81,
              2.9, 3.61)
          }
        }

        // 3-5 Yards
        else if (yards == 3){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (5.9 * 2), (6.61 * 2),
              5.9, 8.61,
              2.2, 4.81,
              15.9, 23.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 2.6,
              2.3, 3.82,
              (4.2 * 2), (7.81 * 2),
              4.2, 7.81,
              2.2, 4.81,
              10.9, 12.61)
          } else if (area == 3 || area == 4){
            // Mot of the field
            return multiplier(
              titles,
              1.7, 2.6,
              2.3, 3.82,
              (4.2 * 2), (7.81 * 2),
              4.2, 7.81,
              2.2, 4.81,
              6.9, 9.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (6.9 * 2), (9.61 * 2),
              5.9, 7.61,
              2.2, 4.81,
              2.9, 3.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 2.6,
              1.9, 2.82,
              (7.9 * 2), (10.61 * 2),
              3.9, 5.61,
              2.2, 4.81,
              2.9, 3.61)
          }
        }

        // 6-9 Yards
        else if (yards == 4){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (5.9 * 2), (8.61 * 2),
              5.9, 8.61,
              2.2, 4.81,
              15.9, 23.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 2.6,
              1.9, 3.82,
              (4.2 * 2), (7.81 * 2),
              4.2, 7.81,
              2.2, 4.81,
              10.9, 12.61)
          } else if (area == 3 || area == 4){
            // Mot of the field
            return multiplier(
              titles,
              1.7, 2.6,
              1.9, 3.82,
              (4.2 * 2), (7.81 * 2),
              4.2, 7.81,
              2.2, 4.81,
              6.9, 9.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (6.9 * 2), (9.61 * 2),
              5.9, 7.61,
              2.2, 4.81,
              2.9, 3.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 2.6,
              1.9, 2.82,
              (7.9 * 2), (10.61 * 2),
              3.9, 5.61,
              2.2, 4.81,
              2.9, 3.61)
          }
        }

        // 10-15 Yards
        else if (yards == 5){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (5.9 * 2), (8.61 * 2),
              5.9, 8.61,
              2.2, 4.81,
              15.9, 23.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 2.6,
              2.2, 3.82,
              (4.2 * 2), (7.81 * 2),
              4.2, 7.81,
              2.2, 4.81,
              10.9, 12.61)
          } else if (area == 3 || area == 4){
            // Mot of the field
            return multiplier(
              titles,
              1.7, 2.6,
              2.2, 3.82,
              (4.2 * 2), (7.81 * 2),
              4.2, 7.81,
              2.2, 4.81,
              6.9, 9.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (6.9 * 2), (9.61 * 2),
              5.9, 7.61,
              2.2, 4.81,
              2.9, 3.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 2.6,
              1.9, 2.82,
              (7.9 * 2), (10.61 * 2),
              3.9, 5.61,
              2.2, 4.81,
              2.9, 3.61)
          }
        }

        // 15+ Yards
        else if (yards == 6){
          if(area == 1){
            // Danger zone
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (5.9 * 2), (8.61 * 2),
              5.9, 8.61,
              2.2, 4.81,
              15.9, 23.61)
          } else if (area == 2){
            // Most of the field 11 - 80 yard
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (4.2 * 2), (7.81 * 2),
              4.2, 7.81,
              2.2, 4.81,
              10.9, 12.61)
          } else if (area == 3 || area == 4){
            // Mot of the field
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (4.2 * 2), (7.81 * 2),
              4.2, 7.81,
              2.2, 4.81,
              6.9, 9.61)
          } else if (area == 5){
            // Red Zone
            return multiplier(
              titles,
              1.7, 2.6,
              2.9, 3.82,
              (6.9 * 2), (9.61 * 2),
              5.9, 7.61,
              2.2, 4.81,
              2.9, 3.61)
          } else if (area == 6) {
            // Goal Line
            return multiplier(
              titles,
              1.7, 2.6,
              1.9, 2.82,
              (7.9 * 2), (10.61 * 2),
              3.9, 5.61,
              2.2, 4.81,
              2.9, 3.61)
          }
        }

      // Fourth Down
      } else if (down == 4 && area >= 4) {
        return multiplier(
          titles,
          1.7, 1.7,
          2.4, 3.42,
          2.2, 3.81,
          7.9, 11.61,
          2.2, 4.81,
          4.2, 8.61)
      } else if (down == 4 && area < 4) {
        return multiplier(
          titles,
          1.7, 2.1,
          1.7, 2.32,
          3.2, 4.81,
          9.9, 15.61,
          5.9, 9.81,
          15.9, 21.61)
      } else if (down === 4 && style === 3) {
        return multiplier(
          titles,
          1.7, 2.1,
          2.3, 3.32,
          3.2, 4.81,
          9.9, 15.61,
          5.9, 9.81,
          15.9, 21.61)
      }

      // Point After
      else if (down == 5){
        return multiplier(
          titles,
          1.7, 1.7,
          4.4, 6.42,
          6.2, 8.81,
          3.9, 6.61,
          6.2, 8.81,
          2.9, 3.61)
      }

      // Kickoff
      else if (down == 6){
        if(style <= 2){

          return multiplier(
            titles,
            1.5, 1.7,
            2.4, 3.42,
            5.2, 9.81,
            8.9, 15.61,
            4.2, 6.81,
            19.9, 22.61)
        } else if (style == 3) {
          // "Touchback/No Return"
          // "Neg to 25 Yard Return"
          // "26+ Return"
          // "Failed Onside"
          // "Successful Onside"
          // "Touchdown"
          return multiplier(
            titles,
            2.5, 2.7,
            2.4, 3.42,
            3.2, 4.81,
            1.9, 3.61,
            4.2, 6.81,
            11.9, 15.61)
        }
      }
    }

    // Crazy nested while loops to create all the multiplier documents.
    while (style <= maxStyle){
      while (yards <= maxYards){
        while (area <= maxArea){
          while (down <= maxDown){
            var inputs = {
              "down": down,
              "yards": yards,
              "area": area,
              "style": style
            }
            var options = multipliers(down, yards, area, style)
            Meteor.call('createMultipliers', inputs, options)
            // When max value is reached increase down by one
            down++
          }
          var down = 1
          // When max value is reached increase area by one
          area++
        }
        var area = 1
        // When max value is reached increase yards by one
        yards++
      }
      var yards = 1
      // When max value is reached increase style by one
      style++
    }
  }
});

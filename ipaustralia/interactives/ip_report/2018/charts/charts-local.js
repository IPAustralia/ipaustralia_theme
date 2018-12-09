var lineDecorate = function(data) {
  // shapes
  if (data.type === 'point') {
    // and text
    var label = new Chartist.Svg("text");
    label.text(data.value.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')); //for vertical
    label.attr({
      x: data.x,
      y: data.y - 15,
      "text-anchor": "middle",
      style: "font-family: Arial, sans-serif; font-size: 14px; fill: black"
    });

    if (data.seriesIndex === 0) {
      var square = new Chartist.Svg('path', {
        d: ['M',
          data.x - 5,
          data.y - 5,
          'L',
          data.x - 5,
          data.y + 5,
          'L',
          data.x + 5,
          data.y + 5,
          'L',
          data.x + 5,
          data.y - 5,
          'z'
        ].join(' '),
        style: 'fill-opacity: 1; fill: purple'
      }, 'ct-area');

      data.element.replace(square);
    } else if (data.seriesIndex === 1) {
      var triangle = new Chartist.Svg('path', {
        d: ['M',
          data.x,
          data.y - 8,
          'L',
          data.x - 8,
          data.y + 4,
          'L',
          data.x + 8,
          data.y + 4,
          'z'
        ].join(' '),
        style: 'fill-opacity: 1; fill: orange'
      }, 'ct-area');
      data.element.replace(triangle);
    }
    if (document.body.clientWidth > 768) {
      data.group.append(label);
    };
  }
};

var barDecorate = function(data) {
  if (data.type === 'bar' && document.body.clientWidth > 768) {
    // text
    var label = new Chartist.Svg("text");
    label.text(data.value.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + '%'); //for vertical
    label.attr({
      x: data.x2,
      y: data.value.y > 0 ? data.y2 - 15 : data.y2 + 25,
      "text-anchor": "middle",
      style: "font-family: Arial, sans-serif; font-size: 14px; fill: black"
    });
    data.group.append(label);
  }
};

var barSimpleDecorate = function(data) {
  if (data.type === 'bar' && document.body.clientWidth > 768) {
    // and text
    var label = new Chartist.Svg("text");
    label.text(data.value.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')); //for vertical
    label.attr({
      x: data.x2,
      y: data.value.y > 0 ? data.y2 - 15 : data.y2 + 25,
      "text-anchor": "middle",
      style: "font-family: Arial, sans-serif; font-size: 14px; fill: black"
    });
    data.group.append(label);
  }
};

var stackedTotalPositions = [];
var stackedDecorate = function(data) {
  if (data.type === 'bar' && document.body.clientWidth > 768) {
    if (data.seriesIndex == 2) {
      // totals
      var labelTotal = new Chartist.Svg("text");
      labelTotal.text(data.value.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')); //for vertical
      labelTotal.attr({
        x: data.x2,
        y: stackedTotalPositions[data.index],
        "text-anchor": "middle",
        style: "font-family: Arial, sans-serif; font-size: 14px; fill: black"
      });

      data.group.append(labelTotal);
    } else {
      // others
      // storing 2nd last
      if (data.seriesIndex == 1) {
        stackedTotalPositions[data.index] = data.y2 - 15;
      }
      var label = new Chartist.Svg("text");
      label.text(data.value.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')); //for vertical
      label.attr({
        x: data.x2,
        y: data.y2 + 25,
        "text-anchor": "middle",
        style: "font-family: Arial, sans-serif; font-size: 14px; fill: black"
      });
      data.group.append(label);
    }
  };
};

var horizStackedDecorate = function(data) {
  if (data.type === 'bar' && document.body.clientWidth > 768 && data.value.x != 0) {
    var label = new Chartist.Svg("text");
    label.text(data.value.x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')); //for vertical
    label.attr({
      x: (data.x1 + data.x2) / 2,
      y: data.y2,
      "text-anchor": "middle",
      style: "font-family: Arial, sans-serif; font-size: 14px; fill: black"
    });
    data.group.append(label);
  }
};

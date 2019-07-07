(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 70)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 100
  });

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 80) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };

  var projectCollapse = function() {
      if ($(window).width() < 800) { 
        $(".img-square-wrapper").removeClass("col-6"); 
    } else {
        $(".img-square-wrapper").addClass("col-6");
    }
  }
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Collapse project
  projectCollapse();


})(jQuery); // End of use strict

var baseNodes = [
  { id: "about", group: 0, label: "My Life", level: 6, tag: " sample tag" },
  { id: "career", group: 1, label: "Career Interests", level: 2 },
  { id: "background", group: 1, label: "My Background", level: 2 },
  { id: "extracurricular", group: 1, label: "Extracurriculars", level: 2 },
  { id: "startups", group: 2, label: "I plan to work in startups", level: 2 },
  { id: "ml", group: 2, label: "Machine Learning", level: 1 },
  { id: "health", group: 2, label: "Health Data", level: 2 },
  { id: "abq", group: 2, label: "I was born in ABQ, New Mexico", level: 2 },
  { id: "control", group: 2, label: "I have Worked in Control Systems", level: 1 },
  { id: "research", group: 2, label: "Interdisciplinary Research", level: 2 },
  { id: "ent", group: 2, label: "Entrepreneurship and Innovation", level: 2 },
  { id: "nerd", group: 2, label: "I enjoy Cinema, the MCU, and Game of Thrones", level: 2 },
  { id: "hyperloop", group: 2, label: "Michigan Hyperloop", level: 2 },
  { id: "ultimate", group: 2, label: "Ultimate Frisbee", level: 2 }
]

var baseLinks = [
  { target: "about", source: "career", strength: .1 },
  { target: "about", source: "background", strength: .1 },
  { target: "about", source: "extracurricular", strength: .1 },
  { target: "career", source: "startups", strength: .1 },
  { target: "career", source: "ml", strength: .1 },
  { target: "career", source: "health", strength: .1 },
  { target: "background", source: "abq", strength: .1 },
  { target: "background", source: "control", strength: .1 },
  { target: "extracurricular", source: "research", strength: .1 },
  { target: "extracurricular", source: "ent", strength: .1 },
  { target: "extracurricular", source: "nerd", strength: .1 },
  { target: "extracurricular", source: "hyperloop", strength: .1 },
  { target: "extracurricular", source: "ultimate", strength: .1 }
]

var nodes = [...baseNodes]
var links = [...baseLinks]

var width = window.innerWidth
var height = window.innerHeight

var svg = d3.select('svg')
svg.attr('width', width).attr('height', height)
  .call(responsivefy)

var linkElements,
  nodeElements,
  textElements

// we use svg groups to logically group the elements together
var linkGroup = svg.append('g').attr('class', 'links')
var nodeGroup = svg.append('g').attr('class', 'nodes')
var textGroup = svg.append('g').attr('class', 'texts')

// we use this reference to select/deselect
// after clicking the same element twice
var selectedId

// simulation setup with all forces
var linkForce = d3
  .forceLink()
  .id(function (link) { return link.id })
  .strength(function (link) { return link.strength })

var simulation = d3
  .forceSimulation()
  .force('link', linkForce)
  .force('charge', d3.forceManyBody().strength(- .3*width))
  .force('center', d3.forceCenter(width / 2, height / 2 +50))

var dragDrop = d3.drag().on('start', function (node) {
  node.fx = node.x
  node.fy = node.y
}).on('drag', function (node) {
  simulation.alphaTarget(0.7).restart()
  node.fx = d3.event.x
  node.fy = d3.event.y
}).on('end', function (node) {
  if (!d3.event.active) {
    simulation.alphaTarget(0)
  }
  node.fx = null
  node.fy = null
})

// select node is called on every click
// we either update the data according to the selection
// or reset the data if the same node is clicked twice
function selectNode(selectedNode) {
  if (selectedId === selectedNode.id) {
    selectedId = undefined
    resetData()
    updateSimulation()
  } else {
    selectedId = selectedNode.id
    updateData(selectedNode)
    updateSimulation()
  }

  var neighbors = getNeighbors(selectedNode)

  // we modify the styles to highlight selected nodes
  nodeElements.attr('fill', function (node) { return getNodeColor(node, neighbors) })
  textElements.attr('fill', function (node) { return getTextColor(node, neighbors) })
  linkElements.attr('stroke', function (link) { return getLinkColor(selectedNode, link) })
}

function updateGraph() {
  // links
  linkElements = linkGroup.selectAll('line')
    .data(links, function (link) {
      return link.target.id + link.source.id
    })

  linkElements.exit().remove()

  var linkEnter = linkElements
    .enter().append('line')
    .attr('stroke-width', 2)
    .attr('stroke', '#c9c9c9')

  linkElements = linkEnter.merge(linkElements)

  // nodes
  nodeElements = nodeGroup.selectAll('circle')
    .data(nodes, function (node) { return node.id })

  nodeElements.exit().remove()

  var nodeEnter = nodeElements
    .enter()
    .append('circle')
    .attr('r',  25 + .025*width)
    .attr('fill', '#fcd349')
    .call(dragDrop)
    // we link the selectNode method here
    // to update the graph on every click
    .on('click', selectNode)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  nodeElements = nodeEnter.merge(nodeElements)

  // texts
  textElements = textGroup.selectAll('text')
    .data(nodes, function (node) { return node.id })

  textElements.exit().remove()

  var textEnter = textElements
    .enter()
    .append('text')
    .text(function (node) { return node.label })

    .attr('font-size', 10 + .004*width)
    .attr('text-anchor', 'middle')
    .attr("alignment-baseline", "middle")
  textElements = textEnter.merge(textElements)
}

function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lastline = 0,
      lineHeight = 0.1, // ems
      x = text.attr("x"),
      y = text.attr("y"),
      dy = 0, //parseFloat(text.attr("dy")),
      tspan = text.text(null)
        .append("tspan")
        .attr("x", x)
        .attr("dy", 0);
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if ((tspan.node().getComputedTextLength() > width) && (tspan.node().textContent.split(" ").length > 1)) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
          .attr("dx", 25 - lastline)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + 15)
          .text(word);
      }
      lastline = tspan.node().getComputedTextLength();
    }
    lastline = 0;
  });
}

function selectNode(selectedNode) {
  selectedNode.attr('r', 35 + .025 * width)
}

function updateSimulation() {
  updateGraph()

  simulation.nodes(nodes).on('tick', () => {
    nodeElements
      .attr('cx', function (node) { return node.x })
      .attr('cy', function (node) { return node.y })
    textElements
      .attr('x', function (node) { return node.x })
      .attr('y', function (node) { return node.y })
    linkElements
      .attr('x1', function (link) { return link.source.x })
      .attr('y1', function (link) { return link.source.y })
      .attr('x2', function (link) { return link.target.x })
      .attr('y2', function (link) { return link.target.y })
  })

  simulation.force('link').links(links)
  simulation.alphaTarget(0.7).restart()
}

// last but not least, we call updateSimulation
// to trigger the initial render
updateSimulation()

// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity

  // Use D3 to select element, change color and size
  d3.select(this).attr({
    fill: "orange",
    r: radius * 2
  });

  // Specify where to put label of text
  svg.append("text").attr({
    id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
    x: function () { return xScale(d.x) - 30; },
    y: function () { return yScale(d.y) - 15; }
  })
    .text(function () {
      return [d.x, d.y];  // Value of the text
    });
}

function handleMouseOut(d, i) {
  // Use D3 to select element, change color back to normal
  d3.select(this).attr({
    fill: "black",
    r: radius
  });

  // Select text by id and then remove
  d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
}

function responsivefy(svg) {
  // get container + svg aspect ratio
  var container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style("width")),
    height = parseInt(svg.style("height")),
    aspect = width / height;

  // add viewBox and preserveAspectRatio properties,
  // and call resize so that svg resizes on inital page load
  svg.attr("viewBox", "0 0 " + width + " " + height)
    .attr("perserveAspectRatio", "xMinYMid")
    .call(resize);

  // to register multiple listeners for same event type, 
  // you need to add namespace, i.e., 'click.foo'
  // necessary if you call invoke this function for multiple svgs
  // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  d3.select(window).on("resize." + container.attr("id"), resize);

  // get width of container and resize svg to fit it
  function resize() {
    var targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspect));
  }
}

ScrollReveal().reveal('#project1', {
  delay: 250,
  easing: 'ease-in',
  distance: '10%',
  origin: 'left'
});
ScrollReveal().reveal('#project2', {
  delay: 250,
  easing: 'ease-in',
  distance: '10%',
  origin: 'right'
});
ScrollReveal().reveal('.timeline', {
  delay: 250,
  easing: 'ease-in',
  distance: '10%',
  origin: 'left'
});
ScrollReveal().reveal('.timeline-inverted', {
  delay: 250,
  easing: 'ease-in',
  distance: '10%',
  origin: 'right'
});

ScrollReveal().reveal('.contact-info', {
  delay: 250,
  easing: 'ease-in',
  distance: '10%',
  origin: 'bottom'
});
ScrollReveal().reveal('.intro1', {
  delay: 250
});
ScrollReveal().reveal('.intro2', {
  delay: 1250
});
ScrollReveal().reveal('.intro3', {
  delay: 2250
});



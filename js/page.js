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
if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
  

var root = {
  "name": "bubble",
  "children": [{
    "name": "Background",
    "description": "Hover to Learn about my History",
    "children": [{
      "name": "Albuquerque, NM",
      "address": "",
      "note": "I was born and raised in a small southwestern city, known for hot air balloons, Green Chiles, and beautiful landscape"
    }, {
      "name": "Natural Language Processing",
      "address": "",
      "note": "I have a background in NLP from personal projects, coursework, and Internships"
    }, {
      "name": "Research",
      "address": "",
      "note": "A common thread in my former employment is research: Check out my experience section to learn more"
    }]
  }, {
    "name": "Career",
    "description": "Hover to Learn about my Professional interests",
    "children": [{
      "name": "Machine Learning",
      "address": "",
      "note": "I am interested in both the software and hardware components of this powerful technique"
    }, {
      "name": "Startups",
      "address": "",
      "note": "I hope to work on early stage growth companies, pushing technological progress"
    }, {
      "name": "Health Data",
      "address": "",
      "note": "Through projects and work, I have become interested in how health data can improve everyday lives"
    }]
  }, {
    "name": "Extracurriculars",
    "description": "Hover to Learn about how I spend my Free Time",
    "children": [{
      "name": "Interdisciplinary Research",
      "note": "I enjoy collaborating with multiple disciplines, such as this past year working with UM Geology on experiment engineering",
      "address": ""
    }, {
      "name": "Innovation",
      "note": "VP of New Member Education @ SEPi",
      "address": "sepiumich.com"
    }, {
      "name": "Entertainment",
      "note": "I spend my time watching and discussing Cinema, (my favorites are Tarantino's), keeping up with the news, and listening to Joe Rogan",
      "address": ""
    }, {
      "name": "Ultimate Frisbee",
      "note": "I played in high school, in intramural, and in a competitive summer league",
      "address": ""

    }]
  }]
};

var w = window.innerWidth * 0.95;
var h = Math.ceil(w * 0.7 * .68);
var oR = 0;
var nTop = 0;

var svgContainer = d3.select("#mainBubble")
  .style("height", h + "px");

var svg = d3.select("#mainBubble").append("svg")
  .attr("class", "mainBubbleSVG")
  .attr("width", w)
  .attr("height", h)
  .call(responsivefy)
  .on("mouseleave", function () {
    return resetBubbles();
  });

var mainNote = svg.append("text")
  .attr("id", "bubbleItemNote")
  .attr("x", w / 2)
  .attr("y", w / 2 + 15)
  .attr("font-size", "1.5vw")
  .attr("dominant-baseline", "middle")
  .attr("alignment-baseline", "middle")
  .attr("text-anchor", "middle")
  .style("fill", "#161616")
  .text("Hover to learn more");


//http://sunsp.net/demo/BubbleMenu

var bubbleObj = svg.selectAll(".topBubble")
  .data(root.children)
  .enter().append("g")
  .attr("id", function (d, i) {
    return "topBubbleAndText_" + i
  });

console.log(root);
nTop = root.children.length;
oR = w * .68 / (1 + 3 * nTop);

h = Math.ceil(w * .68 / nTop * 2);
svgContainer.style("height", h + "px");

var colVals = d3.scale.linear().domain([1, 3])
  .interpolate(d3.interpolateHcl)
  .range([d3.rgb("#FDBE18"), d3.rgb('#FFE18F')]);

bubbleObj.append("circle")
  .attr("class", "topBubble")
  .attr("id", function (d, i) {
    return "topBubble" + i;
  })
  .attr("r", function (d) {
    return oR;
  })
  .attr("cx", function (d, i) {
    return oR * (3 * (1 + i) - 1) + (w / 6);
  })
  .attr("cy", (h + oR) / 3)
  .style("fill", function (d, i) {
    return colVals(i);
  }) // #1f77b4
  .style("opacity", 0.6)
  .on("mouseover", function (d, i) {
    return activateBubble(d, i);
  });


bubbleObj.append("text")
  .attr("class", "topBubbleText")
  .attr("x", function (d, i) {
    return oR * (3 * (1 + i) - 1) + (w / 6);
  })
  .attr("y", (h + oR) / 3)
  .style("fill", "#808080") // #1f77b4
  .attr("font-size", "2.25vw")
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("alignment-baseline", "middle")
  .text(function (d) {
    return d.name
  })
  .on("mouseover", function (d, i) {
    return activateBubble(d, i);
  });


for (var iB = 0; iB < nTop; iB++) {
  var childBubbles = svg.selectAll(".childBubble" + iB)
    .data(root.children[iB].children)
    .enter().append("g");

  //var nSubBubble = Math.floor(root.children[iB].children.length/2.0);	

  childBubbles.append("circle")
    .attr("class", "childBubble" + iB)
    .attr("id", function (d, i) {
      return "childBubble_" + iB + "sub_" + i;
    })
    .attr("r", function (d) {
      return oR / 3.0;
    })
    .attr("cx", function (d, i) {
      return (oR * (3 * (iB + 1) - 1) + oR * 1.5 * Math.cos((i - 1) * 45 / 180 * Math.PI) + (w / 6));
    })
    .attr("cy", function (d, i) {
      return ((h + oR) / 3 + oR * 1.5 * Math.sin((i - 1) * 45 / 180 * Math.PI));
    })
    .attr("cursor", "pointer")
    .style("opacity", 0.25)
    .style("fill", function (d, i) {
      return colVals(iB);
    }) // #1f77b4

    .on("click", function (d, i) {
      window.open(d.address);
    })
    .on("mouseover", function (d, i) {
      //window.alert("say something");
      var noteText = "";
      if (d.note == null || d.note == "") {
        noteText = d.address;
      } else {
        noteText = d.note;
      }
      d3.select("#bubbleItemNote").text(noteText);
    })
    .append("svg:title")
    .text(function (d) {
      return d.address;
    });

  childBubbles.append("text")
    .attr("class", "childBubbleText" + iB)
    .attr("x", function (d, i) {
      return (oR * (3 * (iB + 1) - 1) + oR * 1.5 * Math.cos((i - 1) * 45 / 180 * Math.PI) + (w / 6));
    })
    .attr("y", function (d, i) {
      return ((h + oR) / 3 + oR * 1.5 * Math.sin((i - 1) * 45 / 180 * Math.PI));
    })
    .style("opacity", 0.5)
    .attr("text-anchor", "middle")
    .style("fill", "#808080")
    .attr("font-size", ".6vw")
    .attr("font-weight", 400)
    .attr("cursor", "pointer")
    .attr("dominant-baseline", "middle")
    .attr("alignment-baseline", "middle")
    .text(function (d) {
      return d.name
    })
    .on("click", function (d, i) {
      window.open(d.address);
    });

}


//});

resetBubbles = function () {
  w = window.innerWidth * 0.95;
  oR = w * .68 / (1 + 3 * nTop);

  h = Math.ceil(w * .68 / nTop * 2);
  svgContainer.style("height", h + "px");

  mainNote.attr("y", .85*h);

  svg.attr("width", w);
  svg.attr("height", h);

  d3.select("#bubbleItemNote").attr("text-anchor", "middle").text("Hover to learn more");

  var t = svg.transition()
    .duration(650);

  t.selectAll(".topBubble")
    .attr("r", function (d) {
      return oR;
    })
    .attr("cx", function (d, i) {
      return oR * (3 * (1 + i) - 1) + (w / 6);
    })
    .attr("cy", (h + oR) / 3);

  t.selectAll(".topBubbleText")
    .attr("font-size", "2.25vw")
    .attr("x", function (d, i) {
      return oR * (3 * (1 + i) - 1) + (w / 6);
    })
    .attr("y", (h + oR) / 3);

  for (var k = 0; k < nTop; k++) {
    t.selectAll(".childBubbleText" + k)
      .attr("x", function (d, i) {
        return (oR * (3 * (k + 1) - 1) + oR * 1.5 * Math.cos((i - 1) * 45 / 180 * Math.PI) + (w / 6));
      })
      .attr("y", function (d, i) {
        return ((h + oR) / 3 + oR * 1.5 * Math.sin((i - 1) * 45 / 180 * Math.PI));
      })
      .attr("font-size", ".6vw")
      .style("opacity", 0.5);

    t.selectAll(".childBubble" + k)
      .attr("r", function (d) {
        return oR / 3.0;
      })
      .style("opacity", 0.25)
      .attr("cx", function (d, i) {
        return (oR * (3 * (k + 1) - 1) + oR * 1.5 * Math.cos((i - 1) * 45 / 180 * Math.PI) + (w / 6));
      })
      .attr("cy", function (d, i) {
        return ((h + oR) / 3 + oR * 1.5 * Math.sin((i - 1) * 45 / 180 * Math.PI));
      });

  }
}


function activateBubble(d, i) {
  // increase this bubble and decrease others
  var t = svg.transition()
    .duration(d3.event.altKey ? 7500 : 350);

  t.selectAll(".topBubble")
    .attr("cx", function (d, ii) {
      if (i == ii) {
        // Nothing to change
        return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1) + (w / 6);
      } else {
        // Push away a little bit
        if (ii < i) {
          // left side
          return oR * 0.6 * (3 * (1 + ii) - 1) + (w / 6);
        } else {
          // right side
          return oR * (nTop * 3 + 1) - oR * 0.6 * (3 * (nTop - ii) - 1) + (w / 6);
        }
      }
    })
    .attr("r", function (d, ii) {
      if (i == ii)
        return oR * 1.8;
      else
        return oR * 0.8;
    })
    .style("opacity", function (d, ii) {
      return (i == ii) ? .7 : .5;
    });

  t.selectAll(".topBubbleText")
    .attr("x", function (d, ii) {
      if (i == ii) {
        // Nothing to change
        return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1) + (w / 6);
      } else {
        // Push away a little bit
        if (ii < i) {
          // left side
          return oR * 0.6 * (3 * (1 + ii) - 1) + (w / 6);
        } else {
          // right side
          return oR * (nTop * 3 + 1) - oR * 0.6 * (3 * (nTop - ii) - 1) + (w / 6);
        }
      }
    })
    .attr("font-size", function (d, ii) {
      if (i == ii)
        return "3.5vw";
      else
        return "1.5vw";
    });

  var signSide = -1;
  for (var k = 0; k < nTop; k++) {
    signSide = 1;
    if (k < nTop / 2) signSide = 1;
    t.selectAll(".childBubbleText" + k)
      .attr("x", function (d, i) {
        return (oR * (3 * (k + 1) - 1) - 0.6 * oR * (k - 1) + signSide * oR * 2.5 * Math.cos((i - 1) * 45 / 180 * Math.PI) + (w / 6));
      })
      .attr("y", function (d, i) {
        return ((h + oR) / 3 + signSide * oR * 2.5 * Math.sin((i - 1) * 45 / 180 * Math.PI));
      })
      .attr("font-size", function () {
        return (k == i) ? "1.5vw" : ".5vw";
      })
      .style("opacity", function () {
        return (k == i) ? 1 : 0;
      });

    t.selectAll(".childBubble" + k)
      .attr("cx", function (d, i) {
        return (oR * (3 * (k + 1) - 1) - 0.6 * oR * (k - 1) + signSide * oR * 2.5 * Math.cos((i - 1) * 45 / 180 * Math.PI) + (w / 6));
      })
      .attr("cy", function (d, i) {
        return ((h + oR) / 3 + signSide * oR * 2.5 * Math.sin((i - 1) * 45 / 180 * Math.PI));
      })
      .attr("r", function () {
        return (k == i) ? (oR * 0.55) : (oR / 3.0);
      })
      .style("opacity", function () {
        return (k == i) ? .35 : 0;
      });
  }
}

window.onresize = resetBubbles;
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



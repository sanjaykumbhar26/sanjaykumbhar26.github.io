function GetUnique(item) {
    var outputArray = [];
    var classes = temp_c = [];
    var cols = ['col-md-1', 'col-md-2', 'col-md-3', 'col-md-4', 'col-md-6', 'col-md-12',
        'col-sm-1', 'col-sm-2', 'col-sm-3', 'col-sm-4', 'col-sm-6', 'col-sm-12',
        'col-lg-1', 'col-lg-2', 'col-lg-3', 'col-lg-4', 'col-lg-6', 'col-lg-12',
        'col-xs-1', 'col-xs-2', 'col-xs-3', 'col-xs-4', 'col-xs-6', 'col-xs-12',
        'col-xl-1', 'col-xl-2', 'col-xl-3', 'col-xl-4', 'col-xl-6', 'col-xl-12'];
    $(item).each(function() {
        var temp = $(item + ' > div').attr('class').split(/\s+/);
        for (var i = 0; i < temp.length; i++) {
            classes.push(temp[i]);
        }
    });
    for (var i = 0; i < classes.length; i++) {
        temp_c = classes[i].split('-');
        if (temp_c.length == 2) {
            temp_c.push('');
            temp_c[2] = temp_c[1];
            temp_c[1] = 'xs';
            classes[i] = temp_c.join("-");
        }
        if ($.inArray(classes[i], outputArray) == -1) {
            if ($.inArray(classes[i], cols)) {
                outputArray.push(classes[i]);
            }
        }
    }
    return outputArray;
}

function setcss(cls, item, item_inner) {
    var a = [];
    var b = ['', '', '', '', '', ''];
    var c = d = f = g = 0;
    var e = ['xl', 'lg', 'md', 'sm', 'xs'];
    var h = [1200, 992, 768, 567, 0];
    var i = '';
    var l = [];
    for (var i = 0; i < cls.length; i++) {
        var temp = cls[i].split('-');
        if (temp.length == 3) {
          switch (temp[1]) {
            case 'xl':
                d = 0; break;
            case 'lg':
                d = 1; break;
            case 'md':
                d = 2; break;
            case 'sm':
                d = 3; break;
            case 'xs':
                d = 4;
          }
          b[d] = temp[2];
        }
    }
    for (var j = 0; j < b.length; j++) {
        if (b[j] != '') {
            if (c == 0) {
                c = (12 / b[j]);
            }
            f = 12 / b[j];
            g = 100 / f;
            i = item_inner + " > .carousel-item.active.carousel-item-right," + item_inner + " > .carousel-item.carousel-item-next {-webkit-transform: translate3d(" + g + "%, 0, 0);transform: translate3d(" + g + ", 0, 0);left: 0;}" + item_inner + " > .carousel-item.active.carousel-item-left," + item_inner + " > .carousel-item.carousel-item-prev {-webkit-transform: translate3d(-" + g + "%, 0, 0);transform: translate3d(-" + g + "%, 0, 0);left: 0;}" + item_inner + " > .carousel-item.carousel-item-left, " + item_inner + " > .carousel-item.carousel-item-prev.carousel-item-right, " + item_inner + " > .carousel-item.active {-webkit-transform: translate3d(0, 0, 0);transform: translate3d(0, 0, 0);left: 0;}";
            if (f > 1) {
                for (k = 0; k < (f - 1); k++) {
                    l.push(item + " .cloneditem-" + k);
                }
                if (l.length) {
                    i = i + l.join(',') + "{display: block;}";
                }
                l = [];
            }
            if (h[j] != 0) {
                i = "@media all and (min-width: " + h[j] + "px) and (transform-3d), all and (min-width:" + h[j] + "px) and (-webkit-transform-3d) {" + i + "}";
            }
            $('#slider-css').prepend(i);
        }
    }
    $(item).each(function() {
        var itemToClone = $(this);
        for (var i = 0; i < (c - 1); i++) {
            itemToClone = itemToClone.next();
            if (!itemToClone.length) {
                itemToClone = $(this).siblings(':first');
            }
            itemToClone.children(':first-child').clone()
                .addClass("cloneditem-" + (i))
                .appendTo($(this));
        }
    });
}


//Use Different Slider IDs for multiple slider
$(document).ready(function() {
    var item = '#slider-1 .carousel-item';
    var item_inner = "#slider-1 .carousel-inner";
    classes = GetUnique(item);
    setcss(classes, item, item_inner);


});



$(document).ready(function () {
$('#myCarousel').carousel({
    interval: 10000
})
$('.fdi-Carousel .item').each(function () {
    var next = $(this).next();
    if (!next.length) {
        next = $(this).siblings(':first');
    }
    next.children(':first-child').clone().appendTo($(this));

    if (next.next().length > 0) {
        next.next().children(':first-child').clone().appendTo($(this));
    }
    else {
        $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
    }
});
});



$(document).ready(function () {
    var itemsMainDiv = ('.MultiCarousel');
    var itemsDiv = ('.MultiCarousel-inner');
    var itemWidth = "";

    $('.leftLst, .rightLst').click(function () {
        var condition = $(this).hasClass("leftLst");
        if (condition)
            click(0, this);
        else
            click(1, this)
    });

    ResCarouselSize();




    $(window).resize(function () {
        ResCarouselSize();
    });

    //this function define the size of the items
    function ResCarouselSize() {
        var incno = 0;
        var dataItems = ("data-items");
        var itemClass = ('.item');
        var id = 0;
        var btnParentSb = '';
        var itemsSplit = '';
        var sampwidth = $(itemsMainDiv).width();
        var bodyWidth = $('body').width();
        $(itemsDiv).each(function () {
            id = id + 1;
            var itemNumbers = $(this).find(itemClass).length;
            btnParentSb = $(this).parent().attr(dataItems);
            itemsSplit = btnParentSb.split(',');
            $(this).parent().attr("id", "MultiCarousel" + id);


            if (bodyWidth >= 1200) {
                incno = itemsSplit[3];
                itemWidth = sampwidth / incno;
            }
            else if (bodyWidth >= 992) {
                incno = itemsSplit[2];
                itemWidth = sampwidth / incno;
            }
            else if (bodyWidth >= 768) {
                incno = itemsSplit[1];
                itemWidth = sampwidth / incno;
            }
            else {
                incno = itemsSplit[0];
                itemWidth = sampwidth / incno;
            }
            $(this).css({ 'transform': 'translateX(0px)', 'width': itemWidth * itemNumbers });
            $(this).find(itemClass).each(function () {
                $(this).outerWidth(itemWidth);
            });

            $(".leftLst").addClass("over");
            $(".rightLst").removeClass("over");

        });
    }


    //this function used to move the items
    function ResCarousel(e, el, s) {
        var leftBtn = ('.leftLst');
        var rightBtn = ('.rightLst');
        var translateXval = '';
        var divStyle = $(el + ' ' + itemsDiv).css('transform');
        var values = divStyle.match(/-?[\d\.]+/g);
        var xds = Math.abs(values[4]);
        if (e == 0) {
            translateXval = parseInt(xds) - parseInt(itemWidth * s);
            $(el + ' ' + rightBtn).removeClass("over");

            if (translateXval <= itemWidth / 2) {
                translateXval = 0;
                $(el + ' ' + leftBtn).addClass("over");
            }
        }
        else if (e == 1) {
            var itemsCondition = $(el).find(itemsDiv).width() - $(el).width();
            translateXval = parseInt(xds) + parseInt(itemWidth * s);
            $(el + ' ' + leftBtn).removeClass("over");

            if (translateXval >= itemsCondition - itemWidth / 2) {
                translateXval = itemsCondition;
                $(el + ' ' + rightBtn).addClass("over");
            }
        }
        $(el + ' ' + itemsDiv).css('transform', 'translateX(' + -translateXval + 'px)');
    }

    //It is used to get some elements from btn
    function click(ell, ee) {
        var Parent = "#" + $(ee).parent().attr("id");
        var slide = $(Parent).attr("data-slide");
        ResCarousel(ell, Parent, slide);
    }

});

var storage = function (key, value) {
    if (value === undefined) {
        var retval = localStorage.getItem(key);
        return (retval === null)? null : JSON.parse(retval);
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

var createGalleryElement = function (imageId, imageName, selected, origin, onClick) {
    var container = $('<div/>', {
        'class': 'col-md-3 col-sm-4 col-xs-6'
    });

    var image = $('<img/>', {
        'id': imageId,
        'class': 'img-responsive image' + (selected? ' image-selected' : ''),
        'src': './images/' + imageName + '.jpg',
        'data-image-name': imageName,
        'data-origin': origin,
        'click': onClick
    });

    return container.append(image);
};

var fillGallery = function (gallery) {
    var clickHandler = function (e) {
        var that = $(this);

        that.removeClass('highlighted');

        if (that.hasClass('image-selected')) {
            that.removeClass('image-selected');
            localStorage.removeItem(that.attr('id'));
        } else {
            that.addClass('image-selected');

            storage(that.attr('id'), {
                imageId: that.attr('id'),
                imageName: that.data('image-name'),
                origin: that.data('origin'),
                selected: true
            });
        }
    };

    var prefix = gallery.data('prefix'),
        images = +gallery.data('images');

    var id, name, selected;
    for (var i = 1; i <= images; ++i) {
        id = name = prefix + i;
        selected = storage(id) && storage(id).selected;

        gallery.append(createGalleryElement(id, name, selected, location.href, clickHandler));
    }
};

var fillFavourites = function (favourites) {
    var clickHandler = function (e) {
        storage('redirectionTarget', $(this).attr('id'));
        location.href = $(this).data('origin');
    };

    var value, keys = [];
    for (var key in localStorage) {
        value = storage(key);
        if (value.hasOwnProperty('imageName')) {
            keys.push(value);
        }
    }

    if (keys.length == 0) {
        favourites.append('<p id="no-favourites-message" class="lead">Пока что у вас нет избранных фотографий :(</p>');
        return;
    }

    for (var i = 0; i < keys.length; ++i) {
        favourites.append(createGalleryElement(keys[i].imageId, keys[i].imageName, keys[i].selected, keys[i].origin, clickHandler));
    }
};

$(document).ready(function () {
    var content_holder = $($('.content')[0]);

    if (content_holder.attr('id') === 'gallery') {
        fillGallery(content_holder);

        var redirection_target = storage('redirectionTarget');

        if (redirection_target) {
            $('#' + redirection_target).addClass('highlighted');
            localStorage.removeItem('redirectionTarget');
        }
    } else {
        fillFavourites(content_holder);
    }
});

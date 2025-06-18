$('#add-image').on('click', function () {
    //- $(this).css('background-color', '#fff');
    var imgCount = $('.img-list').children().length || 0
    imgCount - 1 < maxCountImg
        ? $('#fileInput').trigger('click')
        : toastrWarning({
              type: 'warning',
              title: content['modal'].warning,
              description: content['user-msg'].max_images,
          })
})

$('#fileInput').on('change', function (e) {
    e.preventDefault()
    if ($(this).val() != '') {
        $('#uploadForm').submit()
    }
})

// multi/part  form submit
$('#uploadForm').submit(function (e) {
    e.preventDefault()
    ajaxUploadForm(
        {
            _this: this,
            token: token,
        },
        (data) => {
            if (data.code == '200') {
                var setSrc = data.data.path.replace('public', '')
                var makeImage = makeDivImage(setSrc)
                $('.img-list').append(makeImage)
            }
        }
    )
    $('#fileInput').val(null)
})

$(document).on('click', '.remove-file', function () {
    // remove element
    var backupSrc = $(this).closest('div').find('img.img').attr('src')
    var makeInput = `<input class="remove-files" type="hidden" name="remove_images[]" value=${backupSrc} />`
    $('.remove-img-list').append(makeInput)
    $(this).parent().remove()
})

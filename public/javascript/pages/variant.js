$(document).ready(function () {
    let numOfAttribute = 0
    let numOfPriceAttribute = 0

    $('#attributeBtn').on('click', function () {
        const attribute_key = $('#attributeKey').val()
        const attribute_val = $('#attributeVal').val()

        if (!(attribute_key && attribute_val)) {
            toastrWarning({
                type: 'warning',
                title: content['modal'].warning,
                description: `Please fill out the attribute!`,
            })

            return
        }

        const attribute_clone = $('#attribute_demo').clone()

        const attribute_index = $('#attribute_list div').length || numOfAttribute

        attribute_clone.find('.new-attribute:eq(0)').attr({
            name: `attribute_variant[${attribute_index}][key]`,
            value: attribute_key,
        })

        attribute_clone.find('.new-attribute:eq(1)').attr({
            name: `attribute_variant[${attribute_index}][value]`,
            value: attribute_val,
        })

        $('#attributeKey,#attributeVal').val('')
        $('#attribute_list').append(attribute_clone.html())
    })

    $('#attributeBtn1').on('click', function () {
        const attribute_key = $('#attributeKey1').val()
        const attribute_val = $('#attributeVal1').val()

        if (!(attribute_key && attribute_val)) {
            toastrWarning({
                type: 'warning',
                title: content['modal'].warning,
                description: `Please fill out the attribute!`,
            })

            return
        }

        const attribute_clone = $('#attribute_demo1').clone()

        const attribute_index = $('#attribute_list1 div').length || numOfPriceAttribute

        attribute_clone.find('.new-attribute:eq(0)').attr({
            name: `attribute_price[${attribute_index}][min_quantity]`,
            value: attribute_key,
        })

        attribute_clone.find('.new-attribute:eq(1)').attr({
            name: `attribute_price[${attribute_index}][unit_price]`,
            value: attribute_val,
        })

        $('#attributeKey1,#attributeVal1').val('')
        $('#attribute_list1').append(attribute_clone.html())
    })

    $(document).on('click', '.del-attribute', function () {
        $(this).closest('.form-group.row').remove()
    })
})

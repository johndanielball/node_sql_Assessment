$("document").ready(function() {
	getAnimals();

	$("#zooForm").on("submit", function(event) {
		event.preventDefault();

		var newAnimal = {};

		$.each($("#zooForm").serializeArray(), function(i, field) {

			newAnimal[field.name] = field.value;
		});

		$.ajax({
			type: 'post',
			url: '/animal',
			data: newAnimal,
			success: function () {

				$('.animalRecord').remove();
				getAnimals();
			},
			error: function (err) {
				console.log(err);
			}
		});
	});
});

function getAnimals() {
	$.ajax(
		{
			type: 'get',
			url: '/animals',
			success: function(animals) {

				$(animals).each(function(i, animals){

					var row = document.createElement("tr");
					var aType = document.createElement("td");
					var aQuantity = document.createElement("td");

					$(aType).html(animals.animal_type);
					$(aQuantity).html(animals.animal_quantity);

					$(row).append(aType);
					$(row).append(aQuantity);

					//Setting a class for the row to target it with jQuery.
					$(row).addClass("animalRecord");
					//Find the totals row and inset the new row above it.
					$(row).insertAfter($("#animalRecords table tr").last());
				});


				$("#animalRecords table #total td").text(animals);
			},
			error: function(error) {
				console.log(error);
			}

		}
	);
}
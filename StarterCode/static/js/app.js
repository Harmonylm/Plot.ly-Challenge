// Function for a dropdown menu
function optionChanged(ID) {
    // need data to access patient IDs
    d3
    .json("https://raw.githubusercontent.com/Harmonylm/Plot.ly-Challenge/master/data/samples.json")
    .then((samples) => {

        // grabs index of the patient ID
        var arr = samples.names;
        var IDindex = arr.indexOf(ID);
        console.log(IDindex);

        // grabs index of the metadata for patient ID
        var meta = samples.metadata[IDindex];
        console.log("meta", meta);

        // clears old patient's ID
        d3.select("#sample-metadata")
        .selectAll("div").remove();

        // grabs metadata obj for selected ID, uses Object.entries to seperate obj into key:value pairs, and appends to list to be added to page
        for (let [key, value] of Object.entries(meta)) {
            d3.select("#sample-metadata")
            .append("div").text(`${key}: ${value}`);
          };

        // defines current patient based on ID selected during the change
        var patient = samples.samples[IDindex];

        // loops through data associated with patient selected and throws sample_value, otu_id, and otu_label in one new list
        var barData = []
        for (var i=0; i < patient.sample_values.length; i++) {
            var barDatum = {"sample_value": patient.sample_values[i], "otu_id": patient.otu_ids[i], "otu_label": patient.otu_labels[i]};
            barData.push(barDatum); 
        };
        console.log(barData);

        // x and y data lists to be filled in below
        var xdata = [];
        var ydata = [];
        // grabs all labels to be displayed on hover for that patient
        var labels = barData.map(datum => {
            return datum.otu_label;
        });

        // loops through current patient's bar data, pushes data to x and y axis lists as appropriate
        for (var i=0; i < barData.length; i++) {
            currentDatum = barData[i];
            xdata.push(currentDatum.sample_value);
            ydata.push(currentDatum.otu_id);
        };

        // create the bar chart data and layout
        // data is already sorted
        var data = [{
            type: 'bar',
            x: xdata.slice(0, 10).reverse(),
            y: ydata.map(otu_id => {
                    return `OTU ${otu_id}`
                }).slice(0, 10).reverse(),
            orientation: 'h',
            hovertext: labels.slice(0, 10).reverse(),
          }];

        var layout = {
            title: `Subject ${ID}'s Top Ten Bellybutton Micro-Organisms`
        }
          
        Plotly.newPlot('bar', data, layout);

        //grab all the data
        // making the y-values from the bar chart the x-values for the bubble chart
        bubbleX = ydata
        // making the x-values from the bar chart the y-values for the bubble chart
        bubbleY = xdata

        var trace1 = {
            x: bubbleX,
            y: bubbleY,
            mode: 'markers',
            marker: {
             
              color: bubbleX,
              size: bubbleY
            },
            text: labels
          };
          
        var data = [trace1];
          
          var layout = {
            title: 'Bellybutton Biodiversity',
            showlegend: false,
          };
          
        Plotly.newPlot('bubble', data, layout);
        
    });
};

d3
    .json("https://raw.githubusercontent.com/rose-gonoud/plotly-challenge/master/data/samples.json")
    
    .then((samples) => {

        console.log(samples);
        dropdownVals = samples.names;

        // Populate dropdown menu w/ options
        var dropdownMenu = d3.select("#selDataset");
        var options = dropdownMenu.selectAll("option")
            .data(dropdownVals)
            .enter()
            .append("option")
            .text(function(d) {
                return d;
            });

        optionChanged(dropdownMenu.property("value"));
});

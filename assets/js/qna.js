let modelUSE = {};
let input;
let answerDiv;

// Utils for handling vectors
// Functions below taken from https://www.npmjs.com/package/@tensorflow-models/universal-sentence-encoder

// Calculate the dot product of two vector arrays.
const dotProduct = (xs, ys) => {
    const sum = xs => xs ? xs.reduce((a, b) => a + b, 0) : undefined;

    return xs.length === ys.length ?
        sum(zipWith((a, b) => a * b, xs, ys))
        : undefined;
}

// zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
const zipWith =
    (f, xs, ys) => {
        const ny = ys.length;
        return (xs.length <= ny ? xs : xs.slice(0, ny))
            .map((x, i) => f(x, ys[i]));
    }

// General Model

// Given a model, a query (i.e. "What is his current job"), and
// an array of responses (["He is doing great.", "He is currently working at X."]),
// returns responses ranked by best reply.
const process_general = async () => {
    const model = await modelUSE;
    const input = {
        queries: [query.value.toLowerCase()],
        responses: [
            "He has two main strengths fast-learner and highly achiever.",
            "His hobbies are playing chess, conducting side-projects, and writing articles.",
            "I can describe him as a highly-motivated Data Analyst from Indonesia who is currently into Analytics Engineering.",
            "This page is Thoni' personal website :) Feel free to explore this page.",
            "The name of this page's owner is Thoni. Please call him Thoni :)",
            "You can call him Thoni :)",
            "Hi! Welcome to Thoni's personal website. This website is powered by AI to help you understand more about Thoni. Simply ask all of your questions to his personal AI assistant (search bar), and it will give you the response.",
            "You probably don't know Thoni yet. Please feel free to explore this page to know more about him.",
            "He is currently based in Jakarta, Indonesia.",
            "He currently lives in Jakarta, Indonesia.",
            "Age is just a number",
            "Personally, he does love Working From Home (WFH) !",
            "He is currently working as an Data Analyst at Pintu.",
            "He is great at time-management. Everything is scheduled properly in his calendar.",
            "Main strengths: he is a strong-willed, a fast learner, and an effective person.",
            "Strengths: he is a strong-willed, a fast learner, and an effective person.",
            "He pursued a Information System major in Telkom University.",
            "His name is Ahmad Shohibus Sulthoni.",
            "Currently, he works as a data analyst at Pintu.",
            "He has 3 years of working experience in the field of data analytics.",
            "His first full time job was at Stickearn as AI Engineer.",
            "He is very interested in analytics engineering, data analytics, data engineering and data governance.",
            "As a data analyst, his primary responsibility is to collect, analyze, and interpret large sets of data to help organizations make data-driven decisions.",
            "He uses a variety of tools and software in his work, including SQL, Python, Metabase, Excel, and Google Analytics.",
            "As a data analyst, he typically works with various types of data, including customer behavior data, sales data, website traffic data, and finance data.",
            "Some of the most important skills that he has developed as a data analyst include data analysis, data visualization, critical thinking, problem-solving, and communication.",
            "One of the biggest challenges that he faces as a data analyst is working with incomplete or messy data. Another challenge is communicating complex data insights to non-technical stakeholders in a clear and concise manner.",
            "He is interested in following developments in AI and machine learning, blockchain and crypto, and the rise of web3 platforms and decentralized applications.",
            "Some of the most important skills that he has developed include data analysis, critical thinking, problem-solving, communication, and adaptability.",
            "Some potential challenges of working in the crypto and web3 industry include regulatory uncertainty, volatility in cryptocurrency markets, and the need to constantly adapt to new technologies and trends.",
            "According to him, some of the benefits of working remotely include increased productivity, better work-life balance, and the ability to work from anywhere.",
            "His academic background in Information Systems provides him with a strong foundation in understanding how data and technology can be used to solve business problems.",
            "He comes from a small town called Banyuwangi in East Java.",
            "He was awarded 2nd most outstanding student in 2020 before the pandemic."
        ]
    };

    const embeddings = await model.embed(input);
    const embed_query = embeddings['queryEmbedding'].arraySync()[0];
    const embed_responses = embeddings['responseEmbedding'].arraySync();

    let scores = [];
    // compute the dotProduct of each query and response pair.
    for (let i = 0; i < embed_responses.length; i++) {
        scores.push(dotProduct(embed_query, embed_responses[i]));
        if (i == embed_responses.length - 1) {
            // After finished computing the score, hide the loading dots again
            document.getElementById("loading_dots").style.display = 'none';
        }
    }

    var max_idx = scores.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

    console.log(scores);
    console.log(tf.getBackend());

    if (scores[max_idx] < 10.5) {
        chosen_response = "Sorry, I can't respond to that query for now. Please do reach Thoni out directly through LinkedIn to discuss your query with him :)";
    } else {
        chosen_response = input['responses'][max_idx];
    }

    // Show the output
    answerDiv.style.display = 'inline-block';

    answerDiv.innerHTML = chosen_response;
    console.log(chosen_response)
    output_timeout = setTimeout(function () {
        answerDiv.innerHTML = "";
    }, chosen_response.length * 150);

};

// Variable to check it is the first time load or not
i = 0;
i_model = 0;

window.onload = () => {
    query = document.getElementById('myInput');
    search = document.getElementById('myButton');
    answerDiv = document.getElementById("output");

    console.log(query.value)

    query.addEventListener('keyup', async (event) => {
        if (event.key === 'Enter') {
            if (query.value.toLowerCase() == "hi" || query.value.toLowerCase().includes("hello") || query.value.toLowerCase().includes("hallo") || query.value.toLowerCase().includes("how are you") || query.value.toLowerCase().includes("how's day") || query.value.toLowerCase().includes("what's up") || query.value.toLowerCase().includes("how do you do") || query.value.toLowerCase().includes("morning") || query.value.toLowerCase().includes("evening") || query.value.toLowerCase().includes("afternoon") || query.value.toLowerCase().includes("night")) {
                if (i == 0) {
                    // Hide output 
                    answerDiv.style.display = 'none';
                    // Hide Assistant Description and show loading dots for the first query
                    document.getElementById("first_assistant_desc").style.display = 'none';
                } else {
                    // Hide output & clear timeout output from previous iter
                    answerDiv.style.display = 'none';
                    clearTimeout(output_timeout);
                }

                i = i + 1;

                chosen_response = "Thanks for greeting him! Thoni is doing great. Hope you have a wonderful day :)";

                // Show the output
                answerDiv.style.display = 'inline-block';

                answerDiv.innerHTML = chosen_response;
                output_timeout = setTimeout(function () {
                    answerDiv.innerHTML = "";
                }, chosen_response.length * 150);
            } else if (query.value.toLowerCase().includes("where he work") || query.value.toLowerCase().includes("where he works") || query.value.toLowerCase().includes("where is he working")) {
                if (i == 0) {
                    // Hide output 
                    answerDiv.style.display = 'none';
                    // Hide Assistant Description and show loading dots for the first query
                    document.getElementById("first_assistant_desc").style.display = 'none';
                } else {
                    // Hide output & clear timeout output from previous iter
                    answerDiv.style.display = 'none';
                    clearTimeout(output_timeout);
                }

                i = i + 1;

                chosen_response = "He is currently working as an Data Analyst at Pintu.";

                // Show the output
                answerDiv.style.display = 'inline-block';

                answerDiv.innerHTML = chosen_response;
                output_timeout = setTimeout(function () {
                    answerDiv.innerHTML = "";
                }, chosen_response.length * 150);
            } else {
                console.log(i)
                if (i_model == 0) {
                    // Hide output 
                    answerDiv.style.display = 'none';
                    // Hide Assistant Description and show loading dots for the first query
                    document.getElementById("first_assistant_desc").style.display = 'none';
                    document.getElementById("loading_dots").style.display = 'inline-block';
                    modelUSE = use.loadQnA();
                } else {
                    // Hide output & clear timeout output from previous iter
                    answerDiv.style.display = 'none';
                    clearTimeout(output_timeout);
                }

                i_model = i_model + 1;

                // Currently only supports Web version for AI personal assistant, because of the precision issue (16 vs 32 bit) using WebGL backend and CPU backend is too slow. 
                tf.setBackend('webgl');
                process_general();
            }
        }
    });
};
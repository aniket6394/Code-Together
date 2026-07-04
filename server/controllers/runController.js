const axios = require("axios");

const runCode = async (req, res) => {
  const { language, code, input } = req.body;

  try {
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language,
        version: "*",
        files: [
          {
            content: code,
          },
        ],
        stdin: input,
      },
    );

    res.json({
      output:
        response.data.run.stdout ||
        response.data.run.stderr ||
        response.data.compile.stderr ||
        "No Output",
    });
  } catch (err) {
    console.log("ERROR:");
    console.log(err.response?.data);
    console.log(err.response?.status);
    console.log(err.message);

    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
};

module.exports = {
  runCode,
};

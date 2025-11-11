export default function handler(req, res) {
    try {
      const q = (req.query.q || "").toString();
      if (!q.includes(",")) {
        return res.status(400).send("bad request: expected q='dni,grade'");
      }
  
      const [dni, grade] = q.split(",");
      if (!dni || !grade) {
        return res.status(400).send("bad request: missing dni or grade");
      }
  
      const fs = require("fs");
      const path = require("path");
  
      const line = `${dni};${new Date().toLocaleString()};${grade}\n`;
      const fname = path.join("/tmp", `${dni}.nota`);
  
      fs.writeFileSync(fname, line, { encoding: "utf8" });
      // Also write a cumulative audit log:
      fs.appendFileSync(path.join("/tmp", "notas.log"), line, { encoding: "utf8" });
  
      return res.status(200).send("ok");
    } catch (err) {
      console.error(err);
      return res.status(500).send("error");
    }
  }
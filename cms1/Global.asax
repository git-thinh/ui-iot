﻿<%@ Application Language="C#" %>

<script RunAt="server">

    static System.Collections.Concurrent.ConcurrentDictionary<string, int> mDomains
        = new System.Collections.Concurrent.ConcurrentDictionary<string, int>();

    static System.Collections.Concurrent.ConcurrentDictionary<string, string> mTokens
        = new System.Collections.Concurrent.ConcurrentDictionary<string, string>();

    static string[] mPass = new string[] { };

    void Application_Start(object sender, EventArgs e)
    {
        string file = Server.MapPath("~/public/config.txt");
        if (System.IO.File.Exists(file))
        {
            var lines = System.IO.File.ReadAllLines(file).Where(x => x.Trim().Length > 0)
                .Select(x => x.Split('=')).Where(x => x.Length == 2).GroupBy(x => x[0]).Select(x => x.Last()).ToArray();
            for (var i = 0; i < lines.Length; i++)
                try { mDomains.TryAdd(lines[i][0], int.Parse(lines[i][1])); } catch { }
        }

        string fLogin = Server.MapPath("~/data/login.txt");
        if (System.IO.File.Exists(fLogin))
            mPass = System.IO.File.ReadAllLines(fLogin).Where(x => x.Trim().Length > 0).ToArray();
    }

    string createToken(string username)
    {
        string token = "";
        var jsSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
        token = jsSerializer.Serialize(new
        {
            key = Guid.NewGuid(),
            username = username,
            created = DateTime.Now.ToString("yyyyMMddHHmmssfff")
        });

        string toEncode = HttpUtility.UrlEncode(token);
        byte[] toEncodeAsBytes = System.Text.ASCIIEncoding.ASCII.GetBytes(toEncode);
        string sBase64 = System.Convert.ToBase64String(toEncodeAsBytes);
        return sBase64;
    }

    void Application_BeginRequest(object sender, EventArgs e)
    {
        Uri url = HttpContext.Current.Request.Url;
        string domain = url.Authority,
            path = url.AbsolutePath.ToLower().Substring(1),
            file = string.Empty;
        string method = HttpContext.Current.Request.HttpMethod;
        switch (method)
        {
            case "GET":
                switch (path)
                {
                    case "login":
                        HttpContext.Current.RewritePath("~/public/login.html");
                        break;
                    case "admin":
                        HttpContext.Current.RewritePath("~/public/admin.html");
                        break;
                    default:
                        if (mDomains.ContainsKey(domain))
                        {
                            int id = 0;
                            if (mDomains.TryGetValue(domain, out id) && id > 0)
                            {
                                string fileName = (path.Length == 0 ? "index.html" : path);
                                if (!fileName.EndsWith(".html")) fileName += ".html";
                                file = "~/public/" + id.ToString() + "/" + fileName;
                                string f = Server.MapPath(file);
                                if (!System.IO.File.Exists(f)) file = string.Empty;
                            }
                            if (file.Length > 0) HttpContext.Current.RewritePath(file);
                        }
                        break;
                }
                break;
            case "POST":
                bool ok = false;
                string text, json,
                    username = string.Empty,
                    result = string.Empty, token = string.Empty;
                switch (path)
                {
                    case "login":
                        try
                        {
                            var stream = new System.IO.StreamReader(Request.InputStream);
                            text = stream.ReadToEnd();
                            json = HttpUtility.UrlDecode(text);

                            var jsSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                            var dict = (Dictionary<string, object>)jsSerializer.DeserializeObject(json);

                            if (dict.ContainsKey("username") && dict.ContainsKey("password"))
                            {
                                username = dict["username"] as string;
                                if (!string.IsNullOrWhiteSpace(username))
                                {
                                    string line = string.Format("{0}.{1}", username, dict["password"]);
                                    string valid = mPass.FirstOrDefault(x => x == line);
                                    ok = !string.IsNullOrWhiteSpace(valid);
                                }
                            }

                            result = @"{""Ok"":false}";
                            if (ok)
                            {
                                token = createToken(username);
                                string temp = string.Empty;
                                if (mTokens.ContainsKey(username)) mTokens.TryRemove(username, out temp);

                                string userJson = "{}";
                                string fileUser = Server.MapPath("~/data/user/"+username+".json");
                                if (System.IO.File.Exists(fileUser))
                                    userJson = System.IO.File.ReadAllText(fileUser);

                                result = @"{""Ok"":true, ""Data"":" + userJson + @", ""Token"":""" + token + @"""}";
                                mTokens.TryAdd(username, token);
                            }
                        }
                        catch { }

                        HttpContext.Current.Response.Clear();
                        HttpContext.Current.Response.ContentType = "application/json";
                        HttpContext.Current.Response.Write(result);
                        HttpContext.Current.Response.Flush();
                        HttpContext.Current.Response.End();
                        break;
                    case "admin":
                        break;
                    default:
                        break;
                }
                break;
        }
    }
</script>

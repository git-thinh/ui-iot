<%@ Application Language="C#" %>

<script RunAt="server">

    static System.Collections.Concurrent.ConcurrentDictionary<string, int> mDomains
        = new System.Collections.Concurrent.ConcurrentDictionary<string, int>();

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
    }

    void Application_BeginRequest(object sender, EventArgs e)
    {
        Uri url = HttpContext.Current.Request.Url;
        string domain = url.Authority,
            path = url.AbsolutePath.ToLower(),
            file = string.Empty;

        if (mDomains.ContainsKey(domain)) {
            int id = 0;
            if (mDomains.TryGetValue(domain, out id) && id > 0)
            {
                string fileName = (path == "/" ? "index.html" : path);
                if (!fileName.EndsWith(".html")) fileName += ".html";
                file = "~/public/" + id.ToString() + "/" + fileName;
                string f = Server.MapPath(file);
                if (!System.IO.File.Exists(f)) file = string.Empty;
            }
        }

        if (file.Length > 0)
        {
            HttpContext.Current.RewritePath(file);
        }
    }
</script>

(function () {
  return {
    model: {
      api: {
        id: 1,
        name: 'api',
        title: '',
        type: 'template',
        include: {
          attribute: {
            host: {
              schema: '',
              name: '',
              port: 80
            },
            path: {
              scope: '',
              version: '',
              model: '',
              entity: '',
              behavior: '',
              option: ''
            },
            query: {
            }
          },
          bind: {
            host: function () { },
            path: function () { },
            query: function () { }
          },
        },
        list: {
          host: '[host.schema]://[host.name]:[host.port]',
          path: '[path.scope]/api/[path.version]/[path.model]/[path.entity]/[path.behavior]/[path.option]'
        },
        next: "[schema]://[host]/articles?page[offset]=2",
        last: "[schema]://[host]/articles?page[offset]=10"
      },
      user: {
        "data": [
          {
            "type": "articles",
            "id": "1",
            "attributes": {
              "title": "JSON:API paints my bikeshed!"
            },
            "relationships": {
              "author": {
                "links": {
                  "self": "http://example.com/articles/1/relationships/author",
                  "related": "http://example.com/articles/1/author"
                },
                "data": {
                  "type": "people",
                  "id": "9"
                }
              },
              "comments": {
                "links": {
                  "self": "http://example.com/articles/1/relationships/comments",
                  "related": "http://example.com/articles/1/comments"
                },
                "data": [
                  {
                    "type": "comments",
                    "id": "5"
                  },
                  {
                    "type": "comments",
                    "id": "12"
                  }
                ]
              }
            },
            "links": {
              "self": "http://example.com/articles/1"
            }
          }
        ],
        "included": [
          {
            "type": "people",
            "id": "9",
            "attributes": {
              "firstName": "Dan",
              "lastName": "Gebhardt",
              "twitter": "dgeb"
            },
            "links": {
              "self": "http://example.com/people/9"
            }
          },
          {
            "type": "comments",
            "id": "5",
            "attributes": {
              "body": "First!"
            },
            "relationships": {
              "author": {
                "data": {
                  "type": "people",
                  "id": "2"
                }
              }
            },
            "links": {
              "self": "http://example.com/comments/5"
            }
          },
          {
            "type": "comments",
            "id": "12",
            "attributes": {
              "body": "I like XML better"
            },
            "relationships": {
              "author": {
                "data": {
                  "type": "people",
                  "id": "9"
                }
              }
            },
            "links": {
              "self": "http://example.com/comments/12"
            }
          }
        ]
      }
    }
  };
})();

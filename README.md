# Mongoose-Admin

 [Mongoose-Admin](http://www.github.com/marccampbell/mongo-admin) is a plug in admin tool for [mongoose](http://learnboost.github.com/mongoose) for [node.js](http://nodejs.org).

## Installation

```bash
$ npm install mongoose-admin
```

## Known Issues

  - nested objects which contain nested objects cannot be created on new
    documents
  - no pagination of documents when listing


## Features

  - automatic templates for 
    - creating entities
    - editing entities
    - deleting entities
  - listens on configurable port

## Running Tests

Install development dependencies:

```bash
$ npm install
```

Then:

```bash
$ test/run
```

Actively tested with node:

  - 0.4.9

## Authors

  * Marc Campbell

## License 

(The MIT License)

Copyright (c) 2011 Marc Campbell &lt;marc.e.campbell@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


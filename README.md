# kohonen-stars

Here is an example for our library [kohonen], a basic implementation of 
SOM algorithm in JavaScript

It provides both:
* a script using the lib to map a dataset from a multidimensional space into a 2d hexagonal grid of neurons 
* and a script to draw the hexagonal grid

![capture](https://cdn.rawgit.com/seracio/kohonen-stars/master/images/capture.svg)

## Init

```
yarn
```

## SOM

This example is about classifying 155 stars from their spectral data (2799 by stars).
You can read more about this problem by reading this article [Application of Self-Organizing Map to stellar spectral classifications
](./data/subject.pdf) included on the repository and on which is based this example.

There is a [first script](./scripts/parseDat.js) to parse the 2 dat files:
* [stars.dat](./data/stars.dat): description of each stars including their [spectral type](https://en.wikipedia.org/wiki/Stellar_classification)
* [fluxes.dat](./data/fluxes.dat): 2799 data for each stars

The [second script](./scripts/som.js) is the SOM calculation itself using our lib (the repository already provides a generated grid) 

```
npm run parse
npm run som
```

## Vis

Visualisation is made with React and d3

```
npm start
```

## References

* [A Library of Stellar Spectra]
* [Application of Self-Organizing Map to stellar spectral classifications]




[kohonen]: https://github.com/seracio/kohonen
[A Library of Stellar Spectra]: http://cdsarc.u-strasbg.fr/viz-bin/Cat?III/92#sRM2.1
[Application of Self-Organizing Map to stellar spectral classifications]: https://arxiv.org/pdf/1108.0514v1.pdf

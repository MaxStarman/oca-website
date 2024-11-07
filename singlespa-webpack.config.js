const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (angularWebpackConfig, options) => {
    return singleSpaAngularWebpack(angularWebpackConfig, options);
}

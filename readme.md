# Links
- [stencil-library](https://github.com/justifi-tech/web-component-library/tree/framework-monorepo-structure/stencil-library)
- [react-library](https://github.com/justifi-tech/web-component-library/tree/framework-monorepo-structure/react-library)

# Important:
In order for `react-library` to build, you must first create a yarn symlink to `stencil-library` because it is a dependency.

To do this, do the following:
- From the `stencil-library` directory, run `yarn link`
- From the `react-library` run `yarn link "@justifi/webcomponents"`

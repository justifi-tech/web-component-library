# Multi-repo contents
- [stencil-library](https://github.com/justifi-tech/web-component-library/tree/main/stencil-library): Stencil generated component library.
- [react-library](https://github.com/justifi-tech/web-component-library/tree/main/react-library): Auto-generated React Wrapped components.
# Important:
<!-- Should this go to the contributing wiki? -->
In order for `react-library` to build, you must first create a yarn symlink to `stencil-library` because it is a dependency.

To do this, do the following:
- From the `stencil-library` directory, run `yarn link`
- From the `react-library` run `yarn link "justifi-webcomponents"`

const sassOnly = ['text-style', 'breakpoint', 'container', 'z-index']
const buildPath = 'src/styles/tokens/'

export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transforms: ['name/kebab'],
      buildPath,
      files: [
        {
          destination: '_variables.scss',
          format: 'css/variables',
          filter: (token) => !sassOnly.includes(token.path[0]),
          options: { outputReferences: true },
        },
      ],
    },
    scss: {
      transforms: ['name/kebab'],
      buildPath,
      files: [
        {
          destination: '_map.scss',
          format: 'scss/map-deep',
          options: { mapName: 'tokens' },
        },
      ],
    },
  },
}

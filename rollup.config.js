import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/main.tsx',
  output: [
    {
      file: 'dist/bundle.js', // Output file for the minified bundle
      format: 'esm',
      sourcemap: false,
    },
  ],
  plugins: [
    terser({
      compress: {
        unused: true, // Remove unused code
        dead_code: true, // Eliminate dead code
      },
      mangle: {
        toplevel: true, // Mangle variables in the global scope
      },
      output: {
        comments: false, // Remove comments
      },
    }),
  ],
};

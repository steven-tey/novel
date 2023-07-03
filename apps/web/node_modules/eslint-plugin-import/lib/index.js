'use strict';Object.defineProperty(exports, "__esModule", { value: true });var rules = exports.rules = {
  'no-unresolved': require('./rules/no-unresolved'),
  'named': require('./rules/named'),
  'default': require('./rules/default'),
  'namespace': require('./rules/namespace'),
  'no-namespace': require('./rules/no-namespace'),
  'export': require('./rules/export'),
  'no-mutable-exports': require('./rules/no-mutable-exports'),
  'extensions': require('./rules/extensions'),
  'no-restricted-paths': require('./rules/no-restricted-paths'),
  'no-internal-modules': require('./rules/no-internal-modules'),
  'group-exports': require('./rules/group-exports'),
  'no-relative-packages': require('./rules/no-relative-packages'),
  'no-relative-parent-imports': require('./rules/no-relative-parent-imports'),
  'consistent-type-specifier-style': require('./rules/consistent-type-specifier-style'),

  'no-self-import': require('./rules/no-self-import'),
  'no-cycle': require('./rules/no-cycle'),
  'no-named-default': require('./rules/no-named-default'),
  'no-named-as-default': require('./rules/no-named-as-default'),
  'no-named-as-default-member': require('./rules/no-named-as-default-member'),
  'no-anonymous-default-export': require('./rules/no-anonymous-default-export'),
  'no-unused-modules': require('./rules/no-unused-modules'),

  'no-commonjs': require('./rules/no-commonjs'),
  'no-amd': require('./rules/no-amd'),
  'no-duplicates': require('./rules/no-duplicates'),
  'first': require('./rules/first'),
  'max-dependencies': require('./rules/max-dependencies'),
  'no-extraneous-dependencies': require('./rules/no-extraneous-dependencies'),
  'no-absolute-path': require('./rules/no-absolute-path'),
  'no-nodejs-modules': require('./rules/no-nodejs-modules'),
  'no-webpack-loader-syntax': require('./rules/no-webpack-loader-syntax'),
  'order': require('./rules/order'),
  'newline-after-import': require('./rules/newline-after-import'),
  'prefer-default-export': require('./rules/prefer-default-export'),
  'no-default-export': require('./rules/no-default-export'),
  'no-named-export': require('./rules/no-named-export'),
  'no-dynamic-require': require('./rules/no-dynamic-require'),
  'unambiguous': require('./rules/unambiguous'),
  'no-unassigned-import': require('./rules/no-unassigned-import'),
  'no-useless-path-segments': require('./rules/no-useless-path-segments'),
  'dynamic-import-chunkname': require('./rules/dynamic-import-chunkname'),
  'no-import-module-exports': require('./rules/no-import-module-exports'),
  'no-empty-named-blocks': require('./rules/no-empty-named-blocks'),

  // export
  'exports-last': require('./rules/exports-last'),

  // metadata-based
  'no-deprecated': require('./rules/no-deprecated'),

  // deprecated aliases to rules
  'imports-first': require('./rules/imports-first') };


var configs = exports.configs = {
  'recommended': require('../config/recommended'),

  'errors': require('../config/errors'),
  'warnings': require('../config/warnings'),

  // shhhh... work in progress "secret" rules
  'stage-0': require('../config/stage-0'),

  // useful stuff for folks using various environments
  'react': require('../config/react'),
  'react-native': require('../config/react-native'),
  'electron': require('../config/electron'),
  'typescript': require('../config/typescript') };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJydWxlcyIsInJlcXVpcmUiLCJjb25maWdzIl0sIm1hcHBpbmdzIjoiMkVBQU8sSUFBTUEsd0JBQVE7QUFDbkIsbUJBQWlCQyxRQUFRLHVCQUFSLENBREU7QUFFbkIsV0FBU0EsUUFBUSxlQUFSLENBRlU7QUFHbkIsYUFBV0EsUUFBUSxpQkFBUixDQUhRO0FBSW5CLGVBQWFBLFFBQVEsbUJBQVIsQ0FKTTtBQUtuQixrQkFBZ0JBLFFBQVEsc0JBQVIsQ0FMRztBQU1uQixZQUFVQSxRQUFRLGdCQUFSLENBTlM7QUFPbkIsd0JBQXNCQSxRQUFRLDRCQUFSLENBUEg7QUFRbkIsZ0JBQWNBLFFBQVEsb0JBQVIsQ0FSSztBQVNuQix5QkFBdUJBLFFBQVEsNkJBQVIsQ0FUSjtBQVVuQix5QkFBdUJBLFFBQVEsNkJBQVIsQ0FWSjtBQVduQixtQkFBaUJBLFFBQVEsdUJBQVIsQ0FYRTtBQVluQiwwQkFBd0JBLFFBQVEsOEJBQVIsQ0FaTDtBQWFuQixnQ0FBOEJBLFFBQVEsb0NBQVIsQ0FiWDtBQWNuQixxQ0FBbUNBLFFBQVEseUNBQVIsQ0FkaEI7O0FBZ0JuQixvQkFBa0JBLFFBQVEsd0JBQVIsQ0FoQkM7QUFpQm5CLGNBQVlBLFFBQVEsa0JBQVIsQ0FqQk87QUFrQm5CLHNCQUFvQkEsUUFBUSwwQkFBUixDQWxCRDtBQW1CbkIseUJBQXVCQSxRQUFRLDZCQUFSLENBbkJKO0FBb0JuQixnQ0FBOEJBLFFBQVEsb0NBQVIsQ0FwQlg7QUFxQm5CLGlDQUErQkEsUUFBUSxxQ0FBUixDQXJCWjtBQXNCbkIsdUJBQXFCQSxRQUFRLDJCQUFSLENBdEJGOztBQXdCbkIsaUJBQWVBLFFBQVEscUJBQVIsQ0F4Qkk7QUF5Qm5CLFlBQVVBLFFBQVEsZ0JBQVIsQ0F6QlM7QUEwQm5CLG1CQUFpQkEsUUFBUSx1QkFBUixDQTFCRTtBQTJCbkIsV0FBU0EsUUFBUSxlQUFSLENBM0JVO0FBNEJuQixzQkFBb0JBLFFBQVEsMEJBQVIsQ0E1QkQ7QUE2Qm5CLGdDQUE4QkEsUUFBUSxvQ0FBUixDQTdCWDtBQThCbkIsc0JBQW9CQSxRQUFRLDBCQUFSLENBOUJEO0FBK0JuQix1QkFBcUJBLFFBQVEsMkJBQVIsQ0EvQkY7QUFnQ25CLDhCQUE0QkEsUUFBUSxrQ0FBUixDQWhDVDtBQWlDbkIsV0FBU0EsUUFBUSxlQUFSLENBakNVO0FBa0NuQiwwQkFBd0JBLFFBQVEsOEJBQVIsQ0FsQ0w7QUFtQ25CLDJCQUF5QkEsUUFBUSwrQkFBUixDQW5DTjtBQW9DbkIsdUJBQXFCQSxRQUFRLDJCQUFSLENBcENGO0FBcUNuQixxQkFBbUJBLFFBQVEseUJBQVIsQ0FyQ0E7QUFzQ25CLHdCQUFzQkEsUUFBUSw0QkFBUixDQXRDSDtBQXVDbkIsaUJBQWVBLFFBQVEscUJBQVIsQ0F2Q0k7QUF3Q25CLDBCQUF3QkEsUUFBUSw4QkFBUixDQXhDTDtBQXlDbkIsOEJBQTRCQSxRQUFRLGtDQUFSLENBekNUO0FBMENuQiw4QkFBNEJBLFFBQVEsa0NBQVIsQ0ExQ1Q7QUEyQ25CLDhCQUE0QkEsUUFBUSxrQ0FBUixDQTNDVDtBQTRDbkIsMkJBQXlCQSxRQUFRLCtCQUFSLENBNUNOOztBQThDbkI7QUFDQSxrQkFBZ0JBLFFBQVEsc0JBQVIsQ0EvQ0c7O0FBaURuQjtBQUNBLG1CQUFpQkEsUUFBUSx1QkFBUixDQWxERTs7QUFvRG5CO0FBQ0EsbUJBQWlCQSxRQUFRLHVCQUFSLENBckRFLEVBQWQ7OztBQXdEQSxJQUFNQyw0QkFBVTtBQUNyQixpQkFBZUQsUUFBUSx1QkFBUixDQURNOztBQUdyQixZQUFVQSxRQUFRLGtCQUFSLENBSFc7QUFJckIsY0FBWUEsUUFBUSxvQkFBUixDQUpTOztBQU1yQjtBQUNBLGFBQVdBLFFBQVEsbUJBQVIsQ0FQVTs7QUFTckI7QUFDQSxXQUFTQSxRQUFRLGlCQUFSLENBVlk7QUFXckIsa0JBQWdCQSxRQUFRLHdCQUFSLENBWEs7QUFZckIsY0FBWUEsUUFBUSxvQkFBUixDQVpTO0FBYXJCLGdCQUFjQSxRQUFRLHNCQUFSLENBYk8sRUFBaEIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgcnVsZXMgPSB7XG4gICduby11bnJlc29sdmVkJzogcmVxdWlyZSgnLi9ydWxlcy9uby11bnJlc29sdmVkJyksXG4gICduYW1lZCc6IHJlcXVpcmUoJy4vcnVsZXMvbmFtZWQnKSxcbiAgJ2RlZmF1bHQnOiByZXF1aXJlKCcuL3J1bGVzL2RlZmF1bHQnKSxcbiAgJ25hbWVzcGFjZSc6IHJlcXVpcmUoJy4vcnVsZXMvbmFtZXNwYWNlJyksXG4gICduby1uYW1lc3BhY2UnOiByZXF1aXJlKCcuL3J1bGVzL25vLW5hbWVzcGFjZScpLFxuICAnZXhwb3J0JzogcmVxdWlyZSgnLi9ydWxlcy9leHBvcnQnKSxcbiAgJ25vLW11dGFibGUtZXhwb3J0cyc6IHJlcXVpcmUoJy4vcnVsZXMvbm8tbXV0YWJsZS1leHBvcnRzJyksXG4gICdleHRlbnNpb25zJzogcmVxdWlyZSgnLi9ydWxlcy9leHRlbnNpb25zJyksXG4gICduby1yZXN0cmljdGVkLXBhdGhzJzogcmVxdWlyZSgnLi9ydWxlcy9uby1yZXN0cmljdGVkLXBhdGhzJyksXG4gICduby1pbnRlcm5hbC1tb2R1bGVzJzogcmVxdWlyZSgnLi9ydWxlcy9uby1pbnRlcm5hbC1tb2R1bGVzJyksXG4gICdncm91cC1leHBvcnRzJzogcmVxdWlyZSgnLi9ydWxlcy9ncm91cC1leHBvcnRzJyksXG4gICduby1yZWxhdGl2ZS1wYWNrYWdlcyc6IHJlcXVpcmUoJy4vcnVsZXMvbm8tcmVsYXRpdmUtcGFja2FnZXMnKSxcbiAgJ25vLXJlbGF0aXZlLXBhcmVudC1pbXBvcnRzJzogcmVxdWlyZSgnLi9ydWxlcy9uby1yZWxhdGl2ZS1wYXJlbnQtaW1wb3J0cycpLFxuICAnY29uc2lzdGVudC10eXBlLXNwZWNpZmllci1zdHlsZSc6IHJlcXVpcmUoJy4vcnVsZXMvY29uc2lzdGVudC10eXBlLXNwZWNpZmllci1zdHlsZScpLFxuXG4gICduby1zZWxmLWltcG9ydCc6IHJlcXVpcmUoJy4vcnVsZXMvbm8tc2VsZi1pbXBvcnQnKSxcbiAgJ25vLWN5Y2xlJzogcmVxdWlyZSgnLi9ydWxlcy9uby1jeWNsZScpLFxuICAnbm8tbmFtZWQtZGVmYXVsdCc6IHJlcXVpcmUoJy4vcnVsZXMvbm8tbmFtZWQtZGVmYXVsdCcpLFxuICAnbm8tbmFtZWQtYXMtZGVmYXVsdCc6IHJlcXVpcmUoJy4vcnVsZXMvbm8tbmFtZWQtYXMtZGVmYXVsdCcpLFxuICAnbm8tbmFtZWQtYXMtZGVmYXVsdC1tZW1iZXInOiByZXF1aXJlKCcuL3J1bGVzL25vLW5hbWVkLWFzLWRlZmF1bHQtbWVtYmVyJyksXG4gICduby1hbm9ueW1vdXMtZGVmYXVsdC1leHBvcnQnOiByZXF1aXJlKCcuL3J1bGVzL25vLWFub255bW91cy1kZWZhdWx0LWV4cG9ydCcpLFxuICAnbm8tdW51c2VkLW1vZHVsZXMnOiByZXF1aXJlKCcuL3J1bGVzL25vLXVudXNlZC1tb2R1bGVzJyksXG5cbiAgJ25vLWNvbW1vbmpzJzogcmVxdWlyZSgnLi9ydWxlcy9uby1jb21tb25qcycpLFxuICAnbm8tYW1kJzogcmVxdWlyZSgnLi9ydWxlcy9uby1hbWQnKSxcbiAgJ25vLWR1cGxpY2F0ZXMnOiByZXF1aXJlKCcuL3J1bGVzL25vLWR1cGxpY2F0ZXMnKSxcbiAgJ2ZpcnN0JzogcmVxdWlyZSgnLi9ydWxlcy9maXJzdCcpLFxuICAnbWF4LWRlcGVuZGVuY2llcyc6IHJlcXVpcmUoJy4vcnVsZXMvbWF4LWRlcGVuZGVuY2llcycpLFxuICAnbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMnOiByZXF1aXJlKCcuL3J1bGVzL25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzJyksXG4gICduby1hYnNvbHV0ZS1wYXRoJzogcmVxdWlyZSgnLi9ydWxlcy9uby1hYnNvbHV0ZS1wYXRoJyksXG4gICduby1ub2RlanMtbW9kdWxlcyc6IHJlcXVpcmUoJy4vcnVsZXMvbm8tbm9kZWpzLW1vZHVsZXMnKSxcbiAgJ25vLXdlYnBhY2stbG9hZGVyLXN5bnRheCc6IHJlcXVpcmUoJy4vcnVsZXMvbm8td2VicGFjay1sb2FkZXItc3ludGF4JyksXG4gICdvcmRlcic6IHJlcXVpcmUoJy4vcnVsZXMvb3JkZXInKSxcbiAgJ25ld2xpbmUtYWZ0ZXItaW1wb3J0JzogcmVxdWlyZSgnLi9ydWxlcy9uZXdsaW5lLWFmdGVyLWltcG9ydCcpLFxuICAncHJlZmVyLWRlZmF1bHQtZXhwb3J0JzogcmVxdWlyZSgnLi9ydWxlcy9wcmVmZXItZGVmYXVsdC1leHBvcnQnKSxcbiAgJ25vLWRlZmF1bHQtZXhwb3J0JzogcmVxdWlyZSgnLi9ydWxlcy9uby1kZWZhdWx0LWV4cG9ydCcpLFxuICAnbm8tbmFtZWQtZXhwb3J0JzogcmVxdWlyZSgnLi9ydWxlcy9uby1uYW1lZC1leHBvcnQnKSxcbiAgJ25vLWR5bmFtaWMtcmVxdWlyZSc6IHJlcXVpcmUoJy4vcnVsZXMvbm8tZHluYW1pYy1yZXF1aXJlJyksXG4gICd1bmFtYmlndW91cyc6IHJlcXVpcmUoJy4vcnVsZXMvdW5hbWJpZ3VvdXMnKSxcbiAgJ25vLXVuYXNzaWduZWQtaW1wb3J0JzogcmVxdWlyZSgnLi9ydWxlcy9uby11bmFzc2lnbmVkLWltcG9ydCcpLFxuICAnbm8tdXNlbGVzcy1wYXRoLXNlZ21lbnRzJzogcmVxdWlyZSgnLi9ydWxlcy9uby11c2VsZXNzLXBhdGgtc2VnbWVudHMnKSxcbiAgJ2R5bmFtaWMtaW1wb3J0LWNodW5rbmFtZSc6IHJlcXVpcmUoJy4vcnVsZXMvZHluYW1pYy1pbXBvcnQtY2h1bmtuYW1lJyksXG4gICduby1pbXBvcnQtbW9kdWxlLWV4cG9ydHMnOiByZXF1aXJlKCcuL3J1bGVzL25vLWltcG9ydC1tb2R1bGUtZXhwb3J0cycpLFxuICAnbm8tZW1wdHktbmFtZWQtYmxvY2tzJzogcmVxdWlyZSgnLi9ydWxlcy9uby1lbXB0eS1uYW1lZC1ibG9ja3MnKSxcblxuICAvLyBleHBvcnRcbiAgJ2V4cG9ydHMtbGFzdCc6IHJlcXVpcmUoJy4vcnVsZXMvZXhwb3J0cy1sYXN0JyksXG5cbiAgLy8gbWV0YWRhdGEtYmFzZWRcbiAgJ25vLWRlcHJlY2F0ZWQnOiByZXF1aXJlKCcuL3J1bGVzL25vLWRlcHJlY2F0ZWQnKSxcblxuICAvLyBkZXByZWNhdGVkIGFsaWFzZXMgdG8gcnVsZXNcbiAgJ2ltcG9ydHMtZmlyc3QnOiByZXF1aXJlKCcuL3J1bGVzL2ltcG9ydHMtZmlyc3QnKSxcbn07XG5cbmV4cG9ydCBjb25zdCBjb25maWdzID0ge1xuICAncmVjb21tZW5kZWQnOiByZXF1aXJlKCcuLi9jb25maWcvcmVjb21tZW5kZWQnKSxcblxuICAnZXJyb3JzJzogcmVxdWlyZSgnLi4vY29uZmlnL2Vycm9ycycpLFxuICAnd2FybmluZ3MnOiByZXF1aXJlKCcuLi9jb25maWcvd2FybmluZ3MnKSxcblxuICAvLyBzaGhoaC4uLiB3b3JrIGluIHByb2dyZXNzIFwic2VjcmV0XCIgcnVsZXNcbiAgJ3N0YWdlLTAnOiByZXF1aXJlKCcuLi9jb25maWcvc3RhZ2UtMCcpLFxuXG4gIC8vIHVzZWZ1bCBzdHVmZiBmb3IgZm9sa3MgdXNpbmcgdmFyaW91cyBlbnZpcm9ubWVudHNcbiAgJ3JlYWN0JzogcmVxdWlyZSgnLi4vY29uZmlnL3JlYWN0JyksXG4gICdyZWFjdC1uYXRpdmUnOiByZXF1aXJlKCcuLi9jb25maWcvcmVhY3QtbmF0aXZlJyksXG4gICdlbGVjdHJvbic6IHJlcXVpcmUoJy4uL2NvbmZpZy9lbGVjdHJvbicpLFxuICAndHlwZXNjcmlwdCc6IHJlcXVpcmUoJy4uL2NvbmZpZy90eXBlc2NyaXB0JyksXG59O1xuIl19
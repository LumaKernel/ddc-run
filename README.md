# ddc-run

[![Doc](https://img.shields.io/badge/doc-%3Ah%20ddc--run-orange.svg?style=flat-square)](doc/ddc-run.txt)

Deno.run() Completion for ddc.vim

## Required

- [denops.vim](https://github.com/vim-denops/denops.vim)
- [ddc.vim](https://github.com/Shougo/ddc.vim)

## Configuration

```vim
call ddc#custom#alias('source', 'win32yank.exe', 'run')
call ddc#custom#patch_global('sources', ['win32yank.exe'])
call ddc#custom#patch_global('sourceOptions', {
    \ 'win32yank.exe': {
    \   'mark': 'CLIP',
    \ }})
call ddc#custom#patch_global('sourceParams', {
    \ 'win32yank.exe': {
    \   'cmd': ['win32yank.exe', '-o'],
    \ }})

call ddc#custom#alias('source', 'my-command', 'run')
" ...
```

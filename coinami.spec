# -*- mode: python -*-

block_cipher = None


a = Analysis(['halocoin/cli.py'],
             pathex=['.'],
             binaries=[],
             datas=[],
             hiddenimports=['engineio.async_gevent'],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          name='halocoin',
          debug=False,
          strip=False,
          upx=True,
          runtime_tmpdir=None,
          console=True )

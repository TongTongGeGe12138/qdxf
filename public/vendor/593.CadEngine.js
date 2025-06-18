var CadEngine;
(() => {
  'use strict';
  var e,
    t,
    r = {
      593: (e, t, r) => {
        function i(e) {
          return (function (e) {
            let t = {};
            e: for (; !m(e); ) {
              let r = A(e);
              switch (r >>> 3) {
                case 0:
                  break e;
                case 1:
                  t.index = A(e) >>> 0;
                  break;
                case 2:
                  t.count = A(e) >>> 0;
                  break;
                case 3: {
                  let r = h(e);
                  (t.layers || (t.layers = [])).push(n(e)), (e.limit = r);
                  break;
                }
                case 4: {
                  let r = h(e);
                  (t.blocks || (t.blocks = [])).push(o(e)), (e.limit = r);
                  break;
                }
                case 5: {
                  let r = h(e);
                  (t.block_table || (t.block_table = [])).push(s(e)), (e.limit = r);
                  break;
                }
                case 6: {
                  let r = h(e);
                  (t.lines || (t.lines = [])).push(l(e)), (e.limit = r);
                  break;
                }
                case 7: {
                  let r = h(e);
                  (t.meshs || (t.meshs = [])).push(c(e)), (e.limit = r);
                  break;
                }
                case 8: {
                  let r = h(e);
                  (t.line_types || (t.line_types = [])).push(d(e)), (e.limit = r);
                  break;
                }
                default:
                  b(e, 7 & r);
              }
            }
            return t;
          })(v(e));
        }
        function s(e) {
          let t = {};
          e: for (; !m(e); ) {
            let r = A(e);
            switch (r >>> 3) {
              case 0:
                break e;
              case 1:
                t.id = w(e, A(e));
                break;
              case 2:
                t.name = g(e, A(e));
                break;
              case 3: {
                let r = h(e);
                (t.lines || (t.lines = [])).push(l(e)), (e.limit = r);
                break;
              }
              case 4: {
                let r = h(e);
                (t.meshs || (t.meshs = [])).push(c(e)), (e.limit = r);
                break;
              }
              case 5: {
                let r = h(e);
                (t.blocks || (t.blocks = [])).push(o(e)), (e.limit = r);
                break;
              }
              case 6:
                t.point_count = C(e, !0);
                break;
              default:
                b(e, 7 & r);
            }
          }
          return t;
        }
        function o(e) {
          let t = {};
          e: for (; !m(e); ) {
            let r = A(e);
            switch (r >>> 3) {
              case 0:
                break e;
              case 1:
                t.id = w(e, A(e));
                break;
              case 2:
                t.layer_id = w(e, A(e));
                break;
              case 3: {
                let i = t.matrix || (t.matrix = []);
                if (2 == (7 & r)) {
                  let t = h(e);
                  for (; !m(e); ) i.push(E(e));
                  e.limit = t;
                } else i.push(E(e));
                break;
              }
              case 4:
                t.block_id = w(e, A(e));
                break;
              case 5:
                t.block_table_id = w(e, A(e));
                break;
              case 6:
                t.color = A(e) >>> 0;
                break;
              case 7:
                t.color_index = A(e) >>> 0;
                break;
              case 8:
                t.raw_layer_id = w(e, A(e));
                break;
              default:
                b(e, 7 & r);
            }
          }
          return t;
        }
        function n(e) {
          let t = {};
          e: for (; !m(e); ) {
            let r = A(e);
            switch (r >>> 3) {
              case 0:
                break e;
              case 1:
                t.id = w(e, A(e));
                break;
              case 2:
                t.name = g(e, A(e));
                break;
              case 3:
                t.color = A(e) >>> 0;
                break;
              case 4:
                t.color_index = A(e) >>> 0;
                break;
              case 5:
                t.line_count = A(e) >>> 0;
                break;
              case 6:
                t.mesh_count = A(e) >>> 0;
                break;
              default:
                b(e, 7 & r);
            }
          }
          return t;
        }
        function a(e) {
          let t = {};
          e: for (; !m(e); ) {
            let r = A(e);
            switch (r >>> 3) {
              case 0:
                break e;
              case 1:
                t.x = S(e);
                break;
              case 2:
                t.y = S(e);
                break;
              case 3:
                t.z = S(e);
                break;
              default:
                b(e, 7 & r);
            }
          }
          return t;
        }
        function l(e) {
          let t = {};
          e: for (; !m(e); ) {
            let r = A(e);
            switch (r >>> 3) {
              case 0:
                break e;
              case 1:
                t.id = w(e, A(e));
                break;
              case 2:
                t.layer_id = w(e, A(e));
                break;
              case 3:
                t.block_id = w(e, A(e));
                break;
              case 4:
                t.line_type_id = w(e, A(e));
                break;
              case 5:
                t.color = A(e) >>> 0;
                break;
              case 6:
                t.color_index = A(e) >>> 0;
                break;
              case 7: {
                let r = h(e);
                (t.points || (t.points = [])).push(a(e)), (e.limit = r);
                break;
              }
              case 8: {
                let i = t.indexes || (t.indexes = []);
                if (2 == (7 & r)) {
                  let t = h(e);
                  for (; !m(e); ) i.push(A(e) >>> 0);
                  e.limit = t;
                } else i.push(A(e) >>> 0);
                break;
              }
              case 9:
                t.line_type_scale = S(e);
                break;
              case 10:
                t.raw_layer_id = w(e, A(e));
                break;
              case 11:
                t.root_reference_id = w(e, A(e));
                break;
              case 12:
                t.root_block_id = w(e, A(e));
                break;
              case 13:
                (t.block_path || (t.block_path = [])).push(g(e, A(e)));
                break;
              default:
                b(e, 7 & r);
            }
          }
          return t;
        }
        function c(e) {
          let t = {};
          e: for (; !m(e); ) {
            let r = A(e);
            switch (r >>> 3) {
              case 0:
                break e;
              case 1:
                t.id = w(e, A(e));
                break;
              case 2:
                t.layer_id = w(e, A(e));
                break;
              case 3:
                t.block_id = w(e, A(e));
                break;
              case 4:
                t.line_type_id = w(e, A(e));
                break;
              case 5:
                t.color = A(e) >>> 0;
                break;
              case 6:
                t.color_index = A(e) >>> 0;
                break;
              case 7: {
                let i = t.vertexs || (t.vertexs = []);
                if (2 == (7 & r)) {
                  let t = h(e);
                  for (; !m(e); ) i.push(S(e));
                  e.limit = t;
                } else i.push(S(e));
                break;
              }
              case 8: {
                let i = t.indexes || (t.indexes = []);
                if (2 == (7 & r)) {
                  let t = h(e);
                  for (; !m(e); ) i.push(A(e));
                  e.limit = t;
                } else i.push(A(e));
                break;
              }
              case 9:
                t.line_type_scale = S(e);
                break;
              case 10:
                t.raw_layer_id = w(e, A(e));
                break;
              case 11:
                t.root_reference_id = w(e, A(e));
                break;
              case 12:
                t.root_block_id = w(e, A(e));
                break;
              case 13:
                (t.block_path || (t.block_path = [])).push(g(e, A(e)));
                break;
              default:
                b(e, 7 & r);
            }
          }
          return t;
        }
        function d(e) {
          let t = {};
          e: for (; !m(e); ) {
            let r = A(e);
            switch (r >>> 3) {
              case 0:
                break e;
              case 1:
                t.id = w(e, A(e));
                break;
              case 2:
                t.name = g(e, A(e));
                break;
              case 3:
                t.scale = S(e);
                break;
              case 4:
                t.description = w(e, A(e));
                break;
              case 5: {
                let i = t.deash || (t.deash = []);
                if (2 == (7 & r)) {
                  let t = h(e);
                  for (; !m(e); ) i.push(E(e));
                  e.limit = t;
                } else i.push(E(e));
                break;
              }
              case 6: {
                let r = h(e);
                (t.labels || (t.labels = [])).push(u(e)), (e.limit = r);
                break;
              }
              default:
                b(e, 7 & r);
            }
          }
          return t;
        }
        function u(e) {
          let t = {};
          e: for (; !m(e); ) {
            let r = A(e);
            switch (r >>> 3) {
              case 0:
                break e;
              case 1:
                t.label = w(e, A(e));
                break;
              case 2:
                t.postion = E(e);
                break;
              case 3:
                t.scale = E(e);
                break;
              case 4:
                t.angle = E(e);
                break;
              case 5:
                t.offset_x = E(e);
                break;
              case 6:
                t.offset_y = E(e);
                break;
              default:
                b(e, 7 & r);
            }
          }
          return t;
        }
        function h(e) {
          let t = A(e),
            r = e.limit;
          return (e.limit = e.offset + t), r;
        }
        function b(e, t) {
          switch (t) {
            case 0:
              for (; 128 & I(e); );
              break;
            case 2:
              y(e, A(e));
              break;
            case 5:
              y(e, 4);
              break;
            case 1:
              y(e, 8);
              break;
            default:
              throw new Error('Unimplemented type: ' + t);
          }
        }
        let f = new Float32Array(1),
          k = new Uint8Array(f.buffer),
          p = new Float64Array(1),
          _ = new Uint8Array(p.buffer);
        function v(e) {
          return { bytes: e, offset: 0, limit: e.length };
        }
        function y(e, t) {
          if (e.offset + t > e.limit) throw new Error('Skip past limit');
          e.offset += t;
        }
        function m(e) {
          return e.offset >= e.limit;
        }
        function x(e, t) {
          let r = e.offset;
          if (r + t > e.limit) throw new Error('Read past limit');
          return (e.offset += t), r;
        }
        function g(e, t) {
          let r = x(e, t);
          return e.bytes.subarray(r, r + t);
        }
        function w(e, t) {
          let r = x(e, t),
            i = String.fromCharCode,
            s = e.bytes,
            o = '�',
            n = '';
          for (let e = 0; e < t; e++) {
            let a,
              l,
              c,
              d,
              u = s[e + r];
            0 == (128 & u)
              ? (n += i(u))
              : 192 == (224 & u)
              ? e + 1 >= t
                ? (n += o)
                : ((a = s[e + r + 1]),
                  128 != (192 & a)
                    ? (n += o)
                    : ((d = ((31 & u) << 6) | (63 & a)), d < 128 ? (n += o) : ((n += i(d)), e++)))
              : 224 == (240 & u)
              ? e + 2 >= t
                ? (n += o)
                : ((a = s[e + r + 1]),
                  (l = s[e + r + 2]),
                  32896 != (49344 & (a | (l << 8)))
                    ? (n += o)
                    : ((d = ((15 & u) << 12) | ((63 & a) << 6) | (63 & l)),
                      d < 2048 || (d >= 55296 && d <= 57343) ? (n += o) : ((n += i(d)), (e += 2))))
              : 240 == (248 & u)
              ? e + 3 >= t
                ? (n += o)
                : ((a = s[e + r + 1]),
                  (l = s[e + r + 2]),
                  (c = s[e + r + 3]),
                  8421504 != (12632256 & (a | (l << 8) | (c << 16)))
                    ? (n += o)
                    : ((d = ((7 & u) << 18) | ((63 & a) << 12) | ((63 & l) << 6) | (63 & c)),
                      d < 65536 || d > 1114111
                        ? (n += o)
                        : ((d -= 65536), (n += i(55296 + (d >> 10), 56320 + (1023 & d))), (e += 3))))
              : (n += o);
          }
          return n;
        }
        function I(e) {
          return e.bytes[x(e, 1)];
        }
        function E(e) {
          let t = x(e, 4),
            r = e.bytes;
          return (k[0] = r[t++]), (k[1] = r[t++]), (k[2] = r[t++]), (k[3] = r[t++]), f[0];
        }
        function S(e) {
          let t = x(e, 8),
            r = e.bytes;
          return (
            (_[0] = r[t++]),
            (_[1] = r[t++]),
            (_[2] = r[t++]),
            (_[3] = r[t++]),
            (_[4] = r[t++]),
            (_[5] = r[t++]),
            (_[6] = r[t++]),
            (_[7] = r[t++]),
            p[0]
          );
        }
        function A(e) {
          let t,
            r = 0,
            i = 0;
          do {
            (t = I(e)), r < 32 && (i |= (127 & t) << r), (r += 7);
          } while (128 & t);
          return i;
        }
        function C(e, t) {
          let r,
            i = 0,
            s = 0,
            o = 0;
          return (
            (r = I(e)),
            (i = 127 & r),
            128 & r &&
              ((r = I(e)),
              (i |= (127 & r) << 7),
              128 & r &&
                ((r = I(e)),
                (i |= (127 & r) << 14),
                128 & r &&
                  ((r = I(e)),
                  (i |= (127 & r) << 21),
                  128 & r &&
                    ((r = I(e)),
                    (s = 127 & r),
                    128 & r &&
                      ((r = I(e)),
                      (s |= (127 & r) << 7),
                      128 & r &&
                        ((r = I(e)),
                        (s |= (127 & r) << 14),
                        128 & r &&
                          ((r = I(e)),
                          (s |= (127 & r) << 21),
                          128 & r && ((r = I(e)), (o = 127 & r), 128 & r && ((r = I(e)), (o |= (127 & r) << 7)))))))))),
            { low: i | (s << 28), high: (s >>> 4) | (o << 24), unsigned: t }
          );
        }
        var O,
          $ = r(19),
          j = r(477);
        !(function (e) {
          (e.StringToByte = function (e) {
            var t,
              r,
              i = new Array();
            t = e.length;
            for (var s = 0; s < t; s++)
              (r = e.charCodeAt(s)) >= 65536 && r <= 1114111
                ? (i.push(((r >> 18) & 7) | 240),
                  i.push(((r >> 12) & 63) | 128),
                  i.push(((r >> 6) & 63) | 128),
                  i.push((63 & r) | 128))
                : r >= 2048 && r <= 65535
                ? (i.push(((r >> 12) & 15) | 224), i.push(((r >> 6) & 63) | 128), i.push((63 & r) | 128))
                : r >= 128 && r <= 2047
                ? (i.push(((r >> 6) & 31) | 192), i.push((63 & r) | 128))
                : i.push(255 & r);
            return i;
          }),
            (e.BytesToString = function (e) {
              if ('string' == typeof e) return e;
              let t = (function (e) {
                if (e.length > 0 && 0 == e[0]) return !1;
                var t = 0;
                for (; t < e.length; ) {
                  var r,
                    i = e[t++];
                  if (i <= 127) r = 0;
                  else if (i >= 194 && i <= 223) r = 1;
                  else if (i >= 224 && i <= 239) r = 2;
                  else {
                    if (!(i >= 240 && i <= 244)) return !1;
                    r = 3;
                  }
                  for (; r > 0 && t < e.length; ) {
                    if ((i = e[t++]) < 128 || i > 191) return !1;
                    r--;
                  }
                }
                return !0;
              })(e);
              if (t) {
                for (var r = '', i = e, s = 0; s < i.length; s++) {
                  var o = i[s].toString(2),
                    n = o.match(/^1+?(?=0)/);
                  if (n && 8 == o.length) {
                    for (var a = n[0].length, l = i[s].toString(2).slice(7 - a), c = 1; c < a; c++)
                      l += i[c + s].toString(2).slice(2);
                    (r += String.fromCharCode(parseInt(l, 2))), (s += a - 1);
                  } else r += String.fromCharCode(i[s]);
                }
                return r;
              }
              return new TextDecoder('gbk').decode(e);
            });
        })(O || (O = {}));
        var B = r(616);
        class F {
          constructor(e) {
            var t, r;
            (this.root_reference_id = ''),
              (this.block_path = ''),
              (this.root_block_id = ''),
              (this.type = ''),
              (this.id = e.id),
              (this.blockId = e.blockId),
              (this.layerId = e.layerId),
              (this.root_reference_id = e.root_reference_id),
              (null === (t = e.block_path) || void 0 === t ? void 0 : t.length) &&
                e.block_path.forEach((e, t) => {
                  this.block_path += O.BytesToString(e);
                }),
              (this.root_block_id = e.root_block_id);
            const i = new B.V8();
            (this.block_path = null === (r = this.block_path) || void 0 === r ? void 0 : r.replace(/,/g, '')),
              i.appendAsciiStr(this.block_path),
              (this.block_path = i.end());
          }
        }
        class T extends F {
          constructor(e) {
            super(e), (this.index = 0), (this.points = e.points), (this.indexes = e.indexes);
          }
          get V3Points() {
            let e = [];
            for (let t = 0; t < this.points.length; t += 3)
              e.push(new j.Pa4(this.points[t], this.points[t + 1], this.points[t + 2]));
            return e;
          }
          get Lines() {
            let e = this.V3Points,
              t = [];
            for (let r = 0; r < this.indexes.length; r += 2) {
              const i = this.indexes[r],
                s = this.indexes[r + 1];
              t.push(new j.Zzh(e[i], e[s]));
            }
            return t;
          }
          static clone(e) {
            let t = new T({ id: e.id, blockId: e.blockId, indexes: e.indexes, layerId: e.layerId, points: e.points });
            return (
              (t.sphere = e.sphere),
              (t.box = e.box),
              (t.root_reference_id = e.root_reference_id),
              (t.block_path = e.block_path),
              (t.root_block_id = e.root_block_id),
              t
            );
          }
        }
        class P extends F {
          constructor(e) {
            super(e), (this.count = 0), (this.vertexs = e.vertexs), (this.indexes = e.indexes);
          }
          static clone(e) {
            let t = new P({ id: e.id, blockId: e.blockId, indexes: e.indexes, layerId: e.layerId, vertexs: e.vertexs });
            return (
              (t.sphere = e.sphere),
              (t.box = e.box),
              (t.root_reference_id = e.root_reference_id),
              (t.block_path = e.block_path),
              (t.root_block_id = e.root_block_id),
              t
            );
          }
        }
        class U {
          constructor(e, t) {
            (this.Enabled = !0), (this.Visible = !0), (this.Objects = []), (this.Name = e), (this.Id = t);
          }
        }
        class z {
          constructor() {
            (this.m_lineGeos = {}), (this.m_meshGeos = {}), (this.instances = []);
          }
          get meshs() {
            return this.m_meshGeos;
          }
          get lines() {
            return this.m_lineGeos;
          }
        }
        class G extends F {
          constructor(e) {
            super(e), (this.blockRecord = e.blockRecord), (this.matrix = e.matrix);
          }
        }
        function L(e, t) {
          fetch(e)
            .then((e) => e.arrayBuffer())
            .then((e) => {
              try {
                const r = (0, $.Lj)(new Uint8Array(e)),
                  s = i(new Uint8Array(r));
                t(s);
              } catch (e) {
                M(!1);
              }
            });
        }
        function M(e) {
          self.postMessage({ complete: e });
        }
        function R(e, t, r, i) {
          self.postMessage({ lines: e, meshs: t, instances: r, blocks: i });
        }
        let V = {};
        function N(e, t, r, i, s) {
          var o, n, a, l;
          null === (o = e.lines) ||
            void 0 === o ||
            o.forEach((e) => {
              Z(t, e);
            }),
            null === (n = e.meshs) ||
              void 0 === n ||
              n.forEach((e) => {
                D(r, e);
              }),
            null === (a = e.block_table) ||
              void 0 === a ||
              a.forEach((e) => {
                !(function (e, t) {
                  var r, i, s;
                  if (t.id) {
                    let o = new z();
                    (o.instances = []),
                      (o.Name = O.BytesToString(null !== (r = t.name) && void 0 !== r ? r : new Uint8Array())),
                      (o.Id = t.id),
                      null === (i = t.lines) ||
                        void 0 === i ||
                        i.forEach((e) => {
                          Z(o.lines, e);
                        }),
                      null === (s = t.meshs) ||
                        void 0 === s ||
                        s.forEach((e) => {
                          D(o.meshs, e);
                        }),
                      (e[t.id] = o);
                  }
                })(i, e);
              }),
            null === (l = e.blocks) ||
              void 0 === l ||
              l.forEach((e) => {
                !(function (e, t, r) {
                  var i;
                  let s = `${r.layer_id}`;
                  if (r.block_table_id && r.layer_id && r.matrix && r.id) {
                    let o = r.matrix,
                      n = new j.yGw();
                    n.set(...o);
                    let a = e[r.block_table_id],
                      l = new G({
                        id: r.id,
                        blockId: null !== (i = r.block_id) && void 0 !== i ? i : '',
                        layerId: r.layer_id,
                        blockRecord: a,
                        matrix: n,
                      });
                    t[s] || (t[s] = []), t[s].push(l), a.instances.push(l);
                  }
                })(i, s, e);
              });
        }
        function Z(e, t) {
          var r, i, s;
          const o = null !== (r = t.layer_id) && void 0 !== r ? r : '';
          if (!t.points) return;
          let n = [];
          t.points.forEach((e) => {
            var t, r, i;
            n.push(
              null !== (t = e.x) && void 0 !== t ? t : 0,
              null !== (r = e.y) && void 0 !== r ? r : 0,
              null !== (i = e.z) && void 0 !== i ? i : 0,
            );
          });
          let a = `${t.layer_id}_${t.color}`,
            l = new T({
              layerId: o,
              id: null !== (i = t.id) && void 0 !== i ? i : '',
              blockId: null !== (s = t.block_id) && void 0 !== s ? s : '',
              points: new Float32Array(n),
              indexes: new Int32Array(t.indexes || []),
              root_reference_id: t.root_reference_id,
              block_path: t.block_path,
              root_block_id: t.root_block_id,
            }),
            c = new j.aLr(),
            d = new j.ZzF();
          if (
            (d.setFromArray(l.points),
            d.getBoundingSphere(c),
            (l.sphere = c),
            (l.box = d),
            e[a] ? e[a].push(l) : ((e[a] = [l]), V[o].keys[0].push(a)),
            V[o].cal[1]++,
            V[o].cal[1] >= V[o].cal[0] && 0 != V[o].cal[0])
          ) {
            let t = {};
            V[o].keys[0].forEach((r) => {
              (t[r] = e[r]), delete e[r];
            }),
              (V[o].keys[0] = []),
              R(t, void 0, void 0, void 0);
          }
        }
        function D(e, t) {
          var r, i, s, o, n;
          const a = null !== (r = t.layer_id) && void 0 !== r ? r : '';
          if (!t.vertexs) return;
          let l = `${t.layer_id}_${null !== (i = t.color) && void 0 !== i ? i : 0}`,
            c = t.vertexs.length % 9;
          0 != c && t.vertexs.splice(t.vertexs.length - c, c);
          let d = new P({
              layerId: null !== (s = t.layer_id) && void 0 !== s ? s : '',
              id: null !== (o = t.id) && void 0 !== o ? o : '',
              blockId: null !== (n = t.block_id) && void 0 !== n ? n : '',
              vertexs: new Float32Array(t.vertexs),
              indexes: new Int32Array(t.indexes || []),
              root_reference_id: t.root_reference_id,
              block_path: t.block_path,
            }),
            u = new j.aLr(),
            h = new j.ZzF();
          if (
            (h.setFromArray(d.vertexs),
            h.getBoundingSphere(u),
            (d.sphere = u),
            (d.box = h),
            e[l] ? e[l].push(d) : ((e[l] = [d]), V[a].keys[1].push(l)),
            V[a].cal[3]++,
            V[a].cal[3] >= V[a].cal[2] && 0 != V[a].cal[0])
          ) {
            let t = {};
            V[a].keys[1].forEach((r) => {
              (t[r] = e[r]), delete e[r];
            }),
              (V[a].keys[1] = []),
              R(void 0, t, void 0, void 0);
          }
        }
        self.onmessage = ({ data: { command: e, url: t } }) => {
          (0, $.S1)().then(() => {
            L(t, (e) => {
              var r, i;
              let s = null !== (r = e.count) && void 0 !== r ? r : 0,
                o = 0,
                n = [];
              null === (i = e.layers) ||
                void 0 === i ||
                i.forEach((e) => {
                  var t, r, i;
                  if (e.id) {
                    let s = O.BytesToString(null !== (t = e.name) && void 0 !== t ? t : new Uint8Array()),
                      o = new U(s, e.id);
                    (o.Color = e.color),
                      (o.ColorIndex = e.color_index),
                      (o.LineCount = e.line_count),
                      (o.MeshCount = e.mesh_count),
                      n.push(o),
                      (V[e.id] = {
                        cal: [
                          null !== (r = e.line_count) && void 0 !== r ? r : 0,
                          0,
                          null !== (i = e.mesh_count) && void 0 !== i ? i : 0,
                          0,
                        ],
                        keys: [[], []],
                      });
                  }
                }),
                (function (e) {
                  self.postMessage({ layers: e });
                })(n);
              let a = t.substring(0, t.lastIndexOf('.')),
                l = {},
                c = {},
                d = {},
                u = {},
                h = 1,
                b = `${a}_${h}.p2d`;
              N(e, l, c, d, u), 0 == s && (R(l, void 0, u, d), R(void 0, c, u, d), (V = {}), M(!0));
              const f = (e) => {
                o++,
                  h++,
                  N(e, l, c, d, u),
                  s == o && (R(l, void 0, u, d), R(void 0, c, u, d), (V = {}), M(!0)),
                  h <= s && L(`${a}_${h}.p2d`, f);
              };
              L(b, f);
            });
          });
        };
      },
    },
    i = {};
  function s(e) {
    var t = i[e];
    if (void 0 !== t) return t.exports;
    var o = (i[e] = { exports: {} });
    return r[e](o, o.exports, s), o.exports;
  }
  (s.m = r),
    (s.x = () => {
      var e = s.O(void 0, [306], () => s(593));
      return (e = s.O(e));
    }),
    (e = []),
    (s.O = (t, r, i, o) => {
      if (!r) {
        var n = 1 / 0;
        for (d = 0; d < e.length; d++) {
          for (var [r, i, o] = e[d], a = !0, l = 0; l < r.length; l++)
            (!1 & o || n >= o) && Object.keys(s.O).every((e) => s.O[e](r[l]))
              ? r.splice(l--, 1)
              : ((a = !1), o < n && (n = o));
          if (a) {
            e.splice(d--, 1);
            var c = i();
            void 0 !== c && (t = c);
          }
        }
        return t;
      }
      o = o || 0;
      for (var d = e.length; d > 0 && e[d - 1][2] > o; d--) e[d] = e[d - 1];
      e[d] = [r, i, o];
    }),
    (s.d = (e, t) => {
      for (var r in t) s.o(t, r) && !s.o(e, r) && Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
    }),
    (s.f = {}),
    (s.e = (e) => Promise.all(Object.keys(s.f).reduce((t, r) => (s.f[r](e, t), t), []))),
    (s.u = (e) => e + '.CadEngine.js'),
    (s.g = (function () {
      if ('object' == typeof globalThis) return globalThis;
      try {
        return this || new Function('return this')();
      } catch (e) {
        if ('object' == typeof window) return window;
      }
    })()),
    (s.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (() => {
      var e;
      s.g.importScripts && (e = s.g.location + '');
      var t = s.g.document;
      if (!e && t && (t.currentScript && (e = t.currentScript.src), !e)) {
        var r = t.getElementsByTagName('script');
        r.length && (e = r[r.length - 1].src);
      }
      if (!e) throw new Error('Automatic publicPath is not supported in this browser');
      (e = e
        .replace(/#.*$/, '')
        .replace(/\?.*$/, '')
        .replace(/\/[^\/]+$/, '/')),
        (s.p = e);
    })(),
    (() => {
      var e = { 593: 1 };
      s.f.i = (t, r) => {
        e[t] || importScripts(s.p + s.u(t));
      };
      var t = (self.webpackChunkCadEngine = self.webpackChunkCadEngine || []),
        r = t.push.bind(t);
      t.push = (t) => {
        var [i, o, n] = t;
        for (var a in o) s.o(o, a) && (s.m[a] = o[a]);
        for (n && n(s); i.length; ) e[i.pop()] = 1;
        r(t);
      };
    })(),
    (t = s.x),
    (s.x = () => s.e(306).then(t));
  var o = s.x();
  CadEngine = o;
})();
//# sourceMappingURL=593.CadEngine.js.map

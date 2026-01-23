import{j as X,r as d,o as Z,b as l,a as tt,w as at,d as t,p as et,v as st,e as p,q as T,h as N,F as B,t as n,i as nt,f as F}from"./index-DLz77eDA.js";import{a as A,S}from"./sweetalert2.esm.all-BgBW3QO9.js";import{_ as rt}from"./AdminLayout-Dq7EHznS.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";const ot={class:"py-2 space-y-2"},it={class:"flex justify-end"},dt={class:"bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-x-auto"},lt={class:"min-w-full divide-y divide-gray-200 dark:divide-gray-700"},pt={class:"bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"},gt={key:0},ct={key:1},xt={class:"px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"},ut={class:"px-4 py-2 whitespace-nowrap text-xs font-mono text-gray-700 dark:text-gray-300"},yt={class:"px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"},mt={class:"px-4 py-2 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300"},kt={class:"px-4 py-2 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-white"},ht={class:"px-4 py-2 whitespace-nowrap text-center text-sm font-medium space-x-2"},bt=["onClick"],vt=["onClick"],ft={class:"flex justify-end items-center gap-3 py-4 px-1"},wt=["disabled"],_t={class:"text-gray-700 dark:text-gray-300"},Tt=["disabled"],At={key:0,class:"fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"},$t={class:"relative p-6 w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all"},Dt={key:0,class:"mt-4 space-y-4"},zt={class:"grid grid-cols-2 gap-4 text-sm"},jt={class:"font-mono text-gray-900 dark:text-white"},Ct={class:"text-gray-900 dark:text-white"},Pt={class:"font-bold text-blue-600 dark:text-blue-400"},Lt={class:"text-xl font-bold text-green-600 dark:text-green-400"},Mt={class:"overflow-x-auto"},Nt={class:"min-w-full divide-y divide-gray-200 dark:divide-gray-700"},Bt={class:"bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"},Ft={class:"px-4 py-2 text-sm text-gray-900 dark:text-white"},St={class:"px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300"},Ht={class:"px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300"},It={class:"px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-white"},Ot=X({__name:"HistoryTransaksi",setup(Et){const H=nt(),k="https://alentest.my.id/pos",h=d("");let b=null;const I=()=>{b&&clearTimeout(b),b=setTimeout(()=>{o.value=1,y()},400)},v=d([]),$=d([]),c=d(!1),f=d(!1),g=d(null),o=d(1),D=d(10),x=d(1),u=d(null),w=()=>({Authorization:`Bearer ${localStorage.getItem("authToken")}`}),i=e=>e==null||isNaN(e)?"0":new Intl.NumberFormat("id-ID",{minimumFractionDigits:0}).format(e),E=e=>new Date(e).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}),z=e=>new Date(e).toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}),_=e=>{const a=$.value.find(s=>s.id===e);return a?a.nama_pelanggan:"Umum / Tidak Dikenal"},R=async()=>{try{const e=await A.get(`${k}/user/my/data`,{headers:w()});e.data.success&&(u.value={full_name:e.data.data.full_name,toko:{nama_toko:e.data.data.toko.nama_toko,alamat:e.data.data.toko.alamat}})}catch(e){console.error("Gagal mengambil data kasir/toko:",e)}},U=async()=>{try{const e=await A.get(`${k}/pelanggan`,{headers:w()});e.data.success&&($.value=e.data.data)}catch(e){console.error("Gagal mengambil data pelanggan:",e)}},y=async()=>{var e,a;c.value=!0;try{const s=await A.get(`${k}/transaksi`,{headers:w(),params:{page:o.value,limit:D.value,search:h.value}});s.data.success&&(v.value=s.data.data.transaksi.map(r=>({...r,total_bayar:r.total_bayar||"0",total_kembalian:r.total_kembalian||"0",kasir_name:r.kasir_name||"Admin"})),x.value=s.data.data.totalPage,o.value=s.data.data.currentPage,D.value=s.data.data.limit)}catch(s){console.error("Gagal mengambil data transaksi:",s);const r=((a=(e=s.response)==null?void 0:e.data)==null?void 0:a.message)||s.message||"Gagal memuat data riwayat transaksi.";S.fire("Error",r,"error"),H.push("/signin")}finally{c.value=!1}},G=e=>{var C,P,L;const a=parseFloat(e.total_bayar||"0"),s=parseFloat(e.total_harga),r=a-s,j=s-a,J=((C=u.value)==null?void 0:C.toko.nama_toko.toUpperCase())||"TOKO DEFAULT",Y=((P=u.value)==null?void 0:P.toko.alamat)||"Alamat tidak tersedia",W=e.kasir_name||((L=u.value)==null?void 0:L.full_name)||"Admin";return`
        <div style="width: 280px; font-family: monospace; font-size: 12px; padding: 10px; text-align: center; margin-left:10px">
            <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">${J}</div>
                <div style="font-size: 11px; line-height: 1.4;">
                    ${Y.replace(/\n/g,"<br>")}
                </div>
            </div>

            <div style="border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 8px 0; margin: 8px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                    <span><strong>ID:</strong> ${e.id.substring(0,8)}</span>
                    <span><strong>Kasir:</strong> ${W}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                    <span><strong>Tanggal:</strong></span>
                    <span>${z(e.createdAt)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 3px;">
                    <span><strong>Pelanggan:</strong></span>
                    <span>${_(e.pelanggan_id)}</span>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; margin: 8px 0 4px 0; border-bottom: 1px dashed #000; padding-bottom: 4px;">
                <span style="flex: 1; text-align: left;">ITEM</span>
                <span style="width: 30px; text-align: center;">QTY</span>
                <span style="width: 50px; text-align: right;">HARGA</span>
                <span style="width: 50px; text-align: right;">TOTAL</span>
            </div>

            <div>
                ${e.transaksi_details.map(m=>{var M;return`
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                        <span style="flex: 1; text-align: left; word-break: break-word;">${((M=m.produk)==null?void 0:M.nama_produk)||"Unknown"}</span>
                        <span style="width: 30px; text-align: center;">${m.qty}</span>
                        <span style="width: 50px; text-align: right;">${i(parseFloat(m.harga))}</span>
                        <span style="width: 50px; text-align: right;">${i(parseFloat(m.subtotal))}</span>
                    </div>
                `}).join("")}
            </div>

            <div style="border-top: 2px dashed #000; margin: 8px 0; padding-top: 8px;">
                
                <!-- TOTAL BELANJA -->
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; margin-bottom: 4px;">
                    <span>TOTAL BELANJA:</span>
                    <span>Rp ${i(s)}</span>
                </div>

                <!-- TUNAI -->
                ${a>0?`
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                        <span>Tunai:</span>
                        <span>Rp ${i(a)}</span>
                    </div>
                `:""}

                <!-- KEMBALIAN -->
                ${r>0?`
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; color: #2ecc71;">
                        <span>Kembali:</span>
                        <span>Rp ${i(r)}</span>
                    </div>
                `:""}

                <!-- HUTANG -->
                ${j>0?`
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; color: #e74c3c;">
                        <span>Hutang:</span>
                        <span>Rp ${i(j)}</span>
                    </div>
                `:""}

            </div>

            <div style="margin-top: 10px; font-size: 11px; line-height: 1.6;">
                <div>Terima Kasih Atas Kunjungan Anda</div>
                <div>Periksa barang sebelum dibeli</div>
                <div style="font-size: 10px; color: #666;">Barang yang sudah dibeli<br>tidak bisa ditukar atau dikembalikan</div>
            </div>
        </div>
    `},K=e=>{const a=G(e),s=window.open("","","width=350,height=700,scrollbars=yes");if(!s){S.fire("Error","Gagal membuka jendela cetak. Periksa setelan pop-up browser Anda.","error");return}s.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Struk Transaksi ${e.id.substring(0,8)}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Courier New', monospace; 
                        font-size: 12px;
                        background: #f5f5f5;
                        padding: 10px;
                    }
                    @media print {
                        body { padding: 0; background: white; }
                        @page { margin: 0; size: 80mm auto; }
                    }
                </style>
            </head>
            <body onload="window.print(); setTimeout(() => window.close(), 500);">
                ${a}
            </body>
        </html>
    `),s.document.close()},O=e=>{g.value=e,f.value=!0},V=()=>{f.value=!1},q=()=>{o.value<x.value&&(o.value++,y())},Q=()=>{o.value>1&&(o.value--,y())};return Z(async()=>{await R(),await U(),await y()}),(e,a)=>(l(),tt(rt,null,{default:at(()=>[t("div",ot,[t("div",it,[et(t("input",{"onUpdate:modelValue":a[0]||(a[0]=s=>h.value=s),onInput:I,type:"text",placeholder:"Cari nama pelanggan...",class:"w-64 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-white text-sm focus:ring-2 focus:ring-blue-500"},null,544),[[st,h.value]])]),a[6]||(a[6]=t("hr",{class:"border-gray-200 dark:border-gray-700"},null,-1)),t("div",dt,[t("table",lt,[a[5]||(a[5]=t("thead",{class:"bg-gray-50 dark:bg-gray-700/30"},[t("tr",null,[t("th",{class:"px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"}," Tanggal "),t("th",{class:"px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"}," ID Transaksi "),t("th",{class:"px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"}," Pelanggan "),t("th",{class:"px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"}," Total Qty "),t("th",{class:"px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"}," Total Harga "),t("th",{class:"px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"}," Aksi ")])],-1)),t("tbody",pt,[v.value.length===0&&!c.value?(l(),p("tr",gt,a[1]||(a[1]=[t("td",{colspan:"6",class:"px-4 py-8 text-center text-gray-500 dark:text-gray-400"}," Belum ada riwayat transaksi. ",-1)]))):c.value?(l(),p("tr",ct,a[2]||(a[2]=[t("td",{colspan:"6",class:"px-4 py-8 text-center text-blue-500 dark:text-blue-400"}," Memuat data... ",-1)]))):T("",!0),(l(!0),p(B,null,N(v.value,s=>(l(),p("tr",{key:s.id,class:"hover:bg-gray-50 dark:hover:bg-gray-700/50"},[t("td",xt,n(E(s.createdAt)),1),t("td",ut,n(s.id.substring(0,8))+"... ",1),t("td",yt,n(_(s.pelanggan_id)),1),t("td",mt,n(s.total_qty)+" ("+n(s.total_item)+" item) ",1),t("td",kt,n(i(parseFloat(s.total_harga))),1),t("td",ht,[t("button",{onClick:r=>O(s),class:"text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 p-1 rounded inline-flex items-center gap-1"},a[3]||(a[3]=[t("svg",{class:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})],-1),F(" Detail ")]),8,bt),t("button",{onClick:r=>K(s),class:"text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 p-1 rounded inline-flex items-center gap-1"},a[4]||(a[4]=[t("svg",{class:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H9a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2m-6-4H9V9m6 0V9m-6 4h.01M15 9h.01"})],-1),F(" Print ")]),8,vt)])]))),128))])]),t("div",ft,[t("button",{onClick:Q,disabled:o.value<=1,class:"px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded disabled:opacity-50"}," Sebelumnya ",8,wt),t("p",_t," Hal "+n(o.value)+" / "+n(x.value),1),t("button",{onClick:q,disabled:o.value>=x.value,class:"px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded disabled:opacity-50"}," Selanjutnya ",8,Tt)])])]),f.value?(l(),p("div",At,[t("div",$t,[t("div",{class:"flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700"},[a[8]||(a[8]=t("h3",{class:"text-xl font-semibold text-gray-900 dark:text-white"},"Detail Transaksi",-1)),t("button",{onClick:V,class:"text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"},a[7]||(a[7]=[t("svg",{class:"w-5 h-5",fill:"currentColor",viewBox:"0 0 20 20"},[t("path",{"fill-rule":"evenodd",d:"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z","clip-rule":"evenodd"})],-1)]))]),g.value?(l(),p("div",Dt,[t("div",zt,[t("div",null,[a[9]||(a[9]=t("p",{class:"font-medium text-gray-700 dark:text-gray-300"},"ID Transaksi:",-1)),t("p",jt,n(g.value.id),1)]),t("div",null,[a[10]||(a[10]=t("p",{class:"font-medium text-gray-700 dark:text-gray-300"},"Tanggal:",-1)),t("p",Ct,n(z(g.value.createdAt)),1)]),t("div",null,[a[11]||(a[11]=t("p",{class:"font-medium text-gray-700 dark:text-gray-300"},"Pelanggan:",-1)),t("p",Pt,n(_(g.value.pelanggan_id)),1)]),t("div",null,[a[12]||(a[12]=t("p",{class:"font-medium text-gray-700 dark:text-gray-300"},"Total Harga:",-1)),t("p",Lt,n(i(parseFloat(g.value.total_harga))),1)])]),a[14]||(a[14]=t("h4",{class:"font-semibold text-gray-900 dark:text-white mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"}," Rincian Produk ",-1)),t("div",Mt,[t("table",Nt,[a[13]||(a[13]=t("thead",{class:"bg-gray-50 dark:bg-gray-700/30"},[t("tr",null,[t("th",{class:"px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300"}," Produk"),t("th",{class:"px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300"}," Qty"),t("th",{class:"px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300"}," Harga Satuan"),t("th",{class:"px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300"}," Subtotal")])],-1)),t("tbody",Bt,[(l(!0),p(B,null,N(g.value.transaksi_details,s=>{var r;return l(),p("tr",{key:s.id},[t("td",Ft,n(((r=s.produk)==null?void 0:r.nama_produk)||"Produk Tidak Diketahui"),1),t("td",St,n(s.qty),1),t("td",Ht,n(i(parseFloat(s.harga))),1),t("td",It,n(i(parseFloat(s.subtotal))),1)])}),128))])])])])):T("",!0)])])):T("",!0),a[15]||(a[15]=t("div",{id:"print-area",style:{display:"none"}},null,-1))]),_:1}))}});export{Ot as default};

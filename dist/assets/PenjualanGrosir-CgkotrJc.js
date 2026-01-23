import{j as Et,r as o,c as F,y as zt,o as Rt,b as p,a as Nt,w as Ht,d as a,p as tt,v as it,u as Mt,e as g,F as L,h as G,q as D,z as Kt,n as E,t as l,f as et,B as qt,x as rt,i as Ot,A as U}from"./index-CMYJSexJ.js";import{a as K,S as r}from"./sweetalert2.esm.all-BgBW3QO9.js";import{_ as Ft}from"./AdminLayout-Baeh6vKb.js";import{_ as Lt}from"./_plugin-vue_export-helper-DlAUqK2U.js";const Gt={class:"page-container min-h-screen py-2 space-y-2"},Ut={class:"grid grid-cols-1 lg:grid-cols-3 gap-4"},Vt={class:"lg:col-span-2 relative"},Yt=["disabled"],Jt={key:0,class:"dropdown-container absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-10 max-h-200 overflow-y-auto"},Wt=["onClick"],Qt={style:{"font-size":"14px"},class:"dropdown-text space-y-1 border border-gray-200 p-2"},Xt={class:"font-semibold"},Zt={class:"text-green-600 font-medium"},te={key:0,disabled:""},ee=["value"],ae={key:0,class:"card-section p-4 rounded-lg border"},ne={class:"flex justify-between items-center"},se={key:1,class:"space-y-3"},oe={class:"flex items-center gap-2"},le={class:"text-sm font-bold text-title"},ie={class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"},re={class:"mb-3"},de={class:"text-sm font-semibold text-title"},ue={class:"text-lg font-bold text-warning mt-1"},ce={class:"text-xs text-muted mt-2"},pe={class:"flex gap-2 justify-end"},me=["onClick"],ge=["onClick"],fe={class:"card-section rounded-lg shadow-sm border overflow-hidden"},ve={class:"overflow-x-auto"},xe={class:"w-full"},be={class:"divide-y divide-border"},ye={key:0},he={class:"px-6 py-1 text-sm text-body font-medium"},ke={class:"px-6 py-1"},_e={style:{"font-size":"12px"},class:"text-body leading-tight"},we={class:"px-6 py-1 text-center"},Te=["onUpdate:modelValue","onChange"],Be={class:"px-6 py-1 text-right text-sm text-muted-dark"},Pe={class:"px-6 py-1 text-right text-sm font-semibold text-body"},Ie={class:"px-6 py-1 text-center"},je=["onClick"],Se={class:"px-6 py-2 bg-footer border-t flex justify-between items-center"},Ce={class:"text-xl text-primary"},Ae={class:"space-y-4 mt-4"},$e={class:"relative"},De=["value"],Ee={class:"card-section p-5 border rounded-lg space-y-3"},ze={class:"flex justify-between text-sm"},Re={class:"flex justify-between text-sm"},Ne={class:"font-semibold text-body"},He={class:"flex justify-between text-sm border-t pt-3 border-divider"},Me={class:"font-semibold text-body"},Ke={class:"grid grid-cols-1 md:grid-cols-3 gap-4"},qe=["disabled"],Oe={key:0,class:"animate-spin h-5 w-5",fill:"none",viewBox:"0 0 24 24"},Fe=["disabled"],dt="pendingTransactions",Le=Et({__name:"PenjualanGrosir",setup(Ge){const ut=Ot(),z="https://alentest.my.id/pos",k=o(0),ct=localStorage.getItem("role_name"),v=o(-1),V=o([]),Y=o(!1),R=o(!1),m=o(""),f=o(0),pt=o(""),q=o(null),d=o([]),y=o([]),P=o(null),I=o(null),N=o(""),x=o([]),w=o(!1),H=()=>({Authorization:`Bearer ${localStorage.getItem("authToken")}`}),mt=F(()=>{var t;return((t=I.value)==null?void 0:t.role_name)==="superadmin"});o([]);const gt=o("");o(!1);const M=o(""),J=F(()=>{const t=Number(k.value)||0,e=Number(T.value)||0;return t+e}),at=o(null),W=o(null),ft=t=>{/\d/.test(t.key)&&t.preventDefault()},vt=t=>{const e=t.replace(/\D/g,""),n=parseInt(e)||0;f.value=n,e===""?M.value="":M.value=new Intl.NumberFormat("id-ID").format(n)},xt=t=>{const e=t.target;vt(e.value)},bt=t=>{const e=t.target;f.value>0&&(e.value=f.value.toString())},yt=t=>{const e=t.target;f.value>0&&(e.value=M.value)},ht=t=>{t.key==="Enter"&&(t.preventDefault(),U(()=>{var e,n;(e=W.value)==null||e.focus(),(n=W.value)==null||n.click()}))},kt=async t=>{if(!t.trim()){x.value=[],w.value=!1;return}try{const e=await K.get(`${z}/produk`,{params:{search:t},headers:H()});e.data.success&&e.data.data.data&&(x.value=e.data.data.data.map(n=>({barcode:n.barcode,qty:1,nama_produk:n.nama_produk,harga_jual_ritel:parseFloat(n.harga_jual_ritel)})),w.value=!0,v.value=-1)}catch(e){console.error("Error searching products:",e),x.value=[]}},_t=t=>{if(!(!w.value||x.value.length===0))switch(t.key){case"ArrowDown":t.preventDefault(),v.value=Math.min(v.value+1,x.value.length-1);break;case"ArrowUp":t.preventDefault(),v.value=Math.max(v.value-1,-1);break;case"Enter":t.preventDefault(),v.value>=0&&nt(x.value[v.value]);break;case"Escape":t.preventDefault(),w.value=!1,v.value=-1;break}},nt=async t=>{const e=await Dt(t);e!==null&&(Bt(t,e),r.fire({icon:"success",title:"Berhasil",text:`${e} ${t.nama_produk} ditambahkan`,timer:1500,showConfirmButton:!1})),N.value="",x.value=[],w.value=!1,v.value=-1,U(()=>{var n;(n=q.value)==null||n.focus()})},i=t=>t==null||isNaN(t)?"Rp 0":new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(t),T=F(()=>d.value.reduce((t,e)=>t+e.qty*e.harga_jual_ritel,0)),j=F(()=>{const t=Number(f.value)||0,e=Number(J.value)||0;return t-e}),wt=async()=>{try{const t=await K.get(`${z}/user/my/data`,{headers:H()});t.data.success&&(I.value={full_name:t.data.data.full_name,role_name:t.data.data.role_name,toko:{id:t.data.data.toko.id,nama_toko:t.data.data.toko.nama_toko,alamat:t.data.data.toko.alamat}})}catch(t){console.error("Gagal mengambil data kasir:",t)}},st=async t=>{try{const e=await K.get(`${z}/pelanggan/${t}`,{headers:H()});e.data.success&&e.data.data&&(k.value=Number(e.data.data.hutang)||0)}catch(e){console.error("Gagal mengambil hutang pelanggan:",e),k.value=0}};zt(m,async t=>{t?(await st(t),U(()=>{var e;(e=at.value)==null||e.focus()})):k.value=0});const Tt=async()=>{Y.value=!0;try{const t=await K.get(`${z}/pelanggan`,{headers:H()});t.data.success&&(V.value=t.data.data)}catch(t){console.error("Gagal mengambil data pelanggan:",t)}finally{Y.value=!1}},Q=()=>{m.value="",f.value=0,M.value="",d.value=[],pt.value="",P.value=null,U(()=>{var t;(t=q.value)==null||t.focus(),N.value="",x.value=[],w.value=!1})},Bt=(t,e=1)=>{const n=d.value.find(s=>s.barcode===t.barcode);n?(n.qty+=e,d.value=[n,...d.value.filter(s=>s.barcode!==t.barcode)]):d.value.unshift({barcode:t.barcode,qty:e,nama_produk:t.nama_produk,harga_jual_ritel:parseFloat(t.harga_jual_ritel)})},Pt=(t,e)=>{const n=d.value.find(s=>s.barcode===t);n&&(e<=0||isNaN(e)?ot(t):n.qty=e)},ot=t=>{d.value=d.value.filter(e=>e.barcode!==t)},lt=()=>{try{localStorage.setItem(dt,JSON.stringify(y.value))}catch(t){console.error("Error saving pending transactions:",t)}},It=()=>{try{const t=localStorage.getItem(dt);y.value=t?JSON.parse(t):[]}catch(t){console.error("Error loading pending transactions:",t),y.value=[]}},jt=async()=>{if(d.value.length===0){r.fire("Peringatan","Keranjang belanja kosong.","warning");return}if(!m.value){r.fire("Peringatan","Pelanggan harus dipilih untuk menyimpan transaksi pending.","warning");return}const t=V.value.find(s=>s.id===m.value),e=t?t.nama_pelanggan:"Pelanggan Tidak Dikenal",n={id:Date.now(),pelanggan_id:m.value,nama_pelanggan:e,items:[...d.value],tanggal_simpan:new Date().toLocaleString("id-ID"),total:T.value};y.value.push(n),lt(),r.fire("Berhasil","Transaksi telah disimpan sebagai pending.","success"),Q()},St=t=>{Q(),m.value=t.pelanggan_id,d.value=t.items,f.value=0,P.value=t.id,r.fire("Dimuat",`Transaksi untuk ${t.nama_pelanggan} telah dimuat ke keranjang.`,"info"),X(P.value,!1)},X=(t,e=!0)=>{y.value=y.value.filter(n=>n.id!==t),lt(),e&&r.fire("Berhasil","Transaksi pending telah dihapus.","success")},Ct=(t,e,n,s,b,S)=>{const C=t.total_bayar,u=t.total_harga,B=t.total_kembalian,A=t.sisa_hutang,h=c=>new Intl.NumberFormat("id-ID",{minimumFractionDigits:0}).format(c),O=c=>new Date(c).toLocaleDateString("id-ID",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});return`
        <div style="
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            color: #000; 
            width: 100%;
            padding: 0;
            margin: 0;
        ">
            <!-- HEADER TOKO -->
            <div style="text-align: center; margin-bottom: 10px; padding: 0 5px;">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 3px;">
                    ${b.toUpperCase()}
                </div>
                <div style="font-size: 10px; line-height: 1.3; white-space: pre-wrap;">
                    ${S}
                </div>
            </div>

            <!-- GARIS PEMISAH -->
            <div style="border-bottom: 1px solid #000; margin: 5px 0;"></div>

            <!-- INFO TRANSAKSI -->
            <div style="padding: 0 5px; margin-bottom: 5px;margin-left:10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 11px;">
                    <span>No. Struk</span>
                    <span style="font-weight: bold;">: ${t.id.substring(0,12)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 11px;">
                    <span>Tanggal</span>
                    <span>: ${O(t.createdAt)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 11px;">
                    <span>Kasir</span>
                    <span>: ${s}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                    <span>Pelanggan</span>
                    <span>: ${e}</span>
                </div>
            </div>

            <!-- GARIS PEMISAH -->
            <div style="border-bottom: 1px solid #000; margin: 5px 0; margin-left:10px;"></div>

            <!-- HEADER ITEM -->
            <div style="display: flex; padding: 3px 5px; margin-bottom: 3px; font-size: 10px; font-weight: bold;margin-left:10px;">
                <span style="flex: 1;">ITEM</span>
                <span style="width: 30px; text-align: center;">QTY</span>
                <span style="width: 50px; text-align: right;">HARGA</span>
                <span style="width: 55px; text-align: right;">TOTAL</span>
            </div>

            <!-- DAFTAR ITEM -->
            <div style="padding: 0 5px; margin-bottom: 5px;">
                ${n.map(c=>{const _=c.qty*c.harga_jual_ritel;return`
                        <div style="margin-bottom: 4px; border-bottom: 1px dotted #ccc; padding-bottom: 2px; margin-left:10px;">
                            <div style="font-size: 11px; margin-bottom: 2px;">
                                ${c.nama_produk.length>22?c.nama_produk.substring(0,20)+"..":c.nama_produk}
                            </div>
                            <div style="display: flex; font-size: 10px;">
                                <span style="flex: 1;"></span>
                                <span style="width: 30px; text-align: center;">${c.qty}x</span>
                                <span style="width: 50px; text-align: right;">${h(c.harga_jual_ritel)}</span>
                                <span style="width: 55px; text-align: right; font-weight: bold;">${h(_)}</span>
                            </div>
                        </div>
                    `}).join("")}
            </div>

            <!-- GARIS PEMISAH -->
            <div style="border-bottom: 1px solid #000; margin: 5px 0;"></div>

            <!-- TOTAL -->
            <div style="padding: 5px; margin-bottom: 10px;margin-left:10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 12px;">
                    <span>TOTAL</span>
                    <span style="font-weight: bold;">Rp ${h(u)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 11px;">
                    <span>Tunai</span>
                    <span>Rp ${h(C)}</span>
                </div>
                
                ${B>0?`
                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 11px; color: #0066cc;">
                        <span>Kembali</span>
                        <span style="font-weight: bold;">Rp ${h(B)}</span>
                    </div>
                `:""}

                ${A>0?`
                    <div style="display: flex; justify-content: space-between; margin-top: 5px; padding-top: 5px; border-top: 1px solid #000; font-size: 11px; color: #cc0000; font-weight: bold;">
                        <span>SISA HUTANG</span>
                        <span>Rp ${h(A)}</span>
                    </div>
                `:""}
            </div>

            <!-- GARIS PEMISAH -->
            <div style="border-bottom: 1px solid #000; margin: 5px 0;"></div>

            <!-- FOOTER -->
            <div style="text-align: center; padding: 8px 5px; font-size: 11px;">
                <div style="margin-bottom: 5px;">~ TERIMA KASIH ~</div>
                <div style="font-size: 9px; line-height: 1.4;">
                    Barang yang sudah dibeli tidak dapat<br>
                    ditukar / dikembalikan<br>
                    <br>
                    Simpan struk untuk keperluan garansi
                </div>
            </div>

            <!-- SPASI BAWAH UNTUK POTONGAN KERTAS -->
            <div style="height: 15px;"></div>
        </div>
    `},At=(t,e,n,s,b,S)=>{const C=Ct(t,e,n,s,b,S),u=window.open("","","width=380,height=700,scrollbars=no");if(!u){r.fire("Error","Gagal membuka jendela cetak. Periksa setelan pop-up browser Anda.","error");return}u.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Struk #${t.id.substring(0,8)}</title>
                <style>
                    /* Reset CSS */
                    * { 
                        margin: 0; 
                        padding: 0; 
                        box-sizing: border-box; 
                    }
                    
                    html, body { 
                        width: 80mm;
                        margin: 0;
                        padding: 0;
                    }

                    body { 
                        font-family: Arial, Helvetica, sans-serif;
                        background: #fff;
                        color: #000;
                        font-size: 11px;
                    }

                    /* CSS Print untuk Epson TMU 220D */
                    @media print {
                        @page {
                            margin: 0; 
                            size: 80mm auto;
                        }
                        
                        html {
                            margin: 0;
                            padding: 0;
                            width: 80mm;
                        }

                        body {
                            width: 80mm;
                            margin: 0;
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body onload="setTimeout(function() { window.print(); }, 100); setTimeout(function() { window.close(); }, 2500);">
                ${C}
            </body>
        </html>
    `),u.document.close()},$t=async()=>{var S,C;if(!m.value){r.fire("Peringatan","Pelanggan harus dipilih.","warning");return}if(d.value.length===0){r.fire("Peringatan","Keranjang belanja kosong.","warning");return}if(!I.value){r.fire("Error","Data kasir/toko belum dimuat. Mohon refresh halaman atau cek koneksi API.","error");return}if(mt.value&&!gt.value){r.fire("Peringatan","Toko harus dipilih untuk melakukan penjualan.","warning");return}if(!(await r.fire({icon:"question",title:"Konfirmasi Transaksi",html:`<div class="text-left">
                   <p class="mb-3"><strong>Total Belanja:</strong> ${i(T.value)}</p>
                   <p class="mb-3"><strong>Uang Bayar:</strong> ${i(f.value)}</p>
                   <p class="mb-4"><strong>Kembalian/Hutang:</strong> <span class="${j.value<0?"text-red-600 font-bold ":"text-green-600 font-bold"}">${i(Math.abs(j.value))}</span></p>
                   <hr class="my-3">
                   <p class="text-sm text-gray-600">Periksa kembali data di atas sebelum melanjutkan.</p>
               </div>`,showCancelButton:!0,confirmButtonText:"Ya, Lanjutkan",cancelButtonText:"Batalkan",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1,allowEscapeKey:!1})).isConfirmed)return;const e=j.value;if(e<0){const u=Math.abs(e);if(!(await r.fire({icon:"warning",title:"Kurang Bayar!",html:`<p>Pembayaran <strong>kurang</strong> sebesar <strong>${i(u)}</strong>.</p>
                   <p class="mt-2 text-red-500 font-semibold">Transaksi ini akan dicatat sebagai <strong>Hutang</strong>.</p>
                   <p class="text-sm mt-3">Lanjutkan proses transaksi?</p>`,showCancelButton:!0,confirmButtonText:"Ya, Catat Hutang",cancelButtonText:"Batalkan Transaksi",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1,allowEscapeKey:!1})).isConfirmed)return}const n=[...d.value],s=d.value.map(u=>({barcode:u.barcode,qty:u.qty})),b={pelanggan_id:m.value,pembayaran:f.value,items:s};R.value=!0;try{const u=await K.post(`${z}/transaksi/create/ritel`,b,{headers:H()});if(u.data.success){const B=u.data.data.transaksi,A=B.sisa_hutang||0,h=B.total_kembalian||0,O=u.data.data.pelanggan.nama_pelanggan;At(B,O,n,I.value.full_name,I.value.toko.nama_toko,I.value.toko.alamat);let c,_,$;A>0?($="warning",c="Transaksi Tercatat sebagai Hutang!",_=`<p class="text-lg font-bold mt-2">Pelanggan: ${O}</p>
                   <p class="text-xl font-bold mt-1 text-red-600">Sisa Hutang: ${i(A)}</p>`):A===0?(h>0?($="success",c="Transaksi Berhasil!",_=`<p class="text-lg font-bold mt-2">Total Belanja: ${i(T.value)}</p>
                       <p class="text-lg font-bold mt-1">Uang Bayar: ${i(f.value)}</p>
                       <p class="text-xl font-bold mt-2 text-green-600">Kembalian: ${i(h)}</p>`):($="success",c="Transaksi Berhasil!",_='<p class="text-lg font-bold mt-2">Pembayaran Lunas Pas!</p>'),ut.push("/penjualan-grosir")):($="error",c="Error Logika Transaksi!",_='<p class="text-lg font-bold mt-2">Terdeteksi error internal. Hubungi Admin.</p>'),r.fire({icon:$,title:c,html:_,confirmButtonText:"OK",confirmButtonColor:"#0891b2",allowOutsideClick:!1,allowEscapeKey:!1,didOpen:()=>{const Z=document.querySelector(".swal2-confirm");Z&&Z.focus()}}).then(Z=>{P.value!==null&&X(P.value,!1),st(m.value),Q()})}else r.fire({icon:"error",title:"Transaksi Gagal",text:u.data.message||"Terjadi kesalahan saat memproses transaksi."})}catch(u){console.error("Error transaksi:",u),r.fire({icon:"error",title:"Error",text:((C=(S=u.response)==null?void 0:S.data)==null?void 0:C.message)||"Gagal terhubung ke server."})}finally{R.value=!1}},Dt=async t=>{const e=await r.fire({title:"Jumlah Barang",html:`
            <p class="mb-3 text-gray-700 font-medium">${t.nama_produk}</p>
            <input id="qty-input" type="number" min="1" value="1" 
                class="swal2-input w-full text-center text-lg font-bold text-gray-800" 
                autofocus>
        `,showCancelButton:!0,confirmButtonText:"Tambahkan",cancelButtonText:"Batal",confirmButtonColor:"#0891b2",cancelButtonColor:"#6b7280",allowOutsideClick:!1,didOpen:()=>{const n=document.getElementById("qty-input");n&&(n.focus(),n.select(),n.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),r.clickConfirm())}))},preConfirm:()=>{const n=document.getElementById("qty-input"),s=parseInt(n.value);return!s||s<=0||isNaN(s)?(r.showValidationMessage("Masukkan jumlah yang valid (minimal 1)"),!1):s}});return e.isConfirmed&&e.value?e.value:null};return Rt(async()=>{var t;await wt(),await Tt(),It(),(t=q.value)==null||t.focus()}),(t,e)=>(p(),Nt(Ft,null,{default:Ht(()=>[a("div",Gt,[a("div",Ut,[a("div",Vt,[e[3]||(e[3]=a("label",{class:"block text-sm font-medium label-text mb-2"}," Cari Produk ",-1)),tt(a("input",{onKeypress:ft,ref_key:"barcodeInputRef",ref:q,"onUpdate:modelValue":e[0]||(e[0]=n=>N.value=n),type:"text",style:{"font-size":"12px"},placeholder:"Ketik nama produk...",onInput:e[1]||(e[1]=n=>kt(N.value)),onKeydown:_t,disabled:Mt(ct)!=="admin",class:"input-field w-full h-8 px-4 rounded-lg transition"},null,40,Yt),[[it,N.value]]),w.value&&x.value.length>0?(p(),g("div",Jt,[(p(!0),g(L,null,G(x.value,(n,s)=>(p(),g("div",{key:n.barcode,onClick:b=>nt(n),class:E([s===v.value?"dropdown-item-active":"dropdown-item","px-2 py-1 cursor-pointer last:border-b-0 transition"])},[a("div",Qt,[a("div",Xt,l(n.nama_produk),1),a("div",Zt,l(i(n.harga_jual_ritel)),1)])],10,Wt))),128))])):D("",!0)]),a("div",null,[e[5]||(e[5]=a("label",{class:"block text-sm font-medium label-text mb-2"}," Pilih Pelanggan ",-1)),tt(a("select",{"onUpdate:modelValue":e[2]||(e[2]=n=>m.value=n),required:"",style:{"font-size":"12px"},class:"input-field w-full h-8 rounded-lg px-4 transition"},[e[4]||(e[4]=a("option",{value:"",disabled:""},"Pilih Pelanggan...",-1)),Y.value?(p(),g("option",te,"Memuat...")):D("",!0),(p(!0),g(L,null,G(V.value,n=>(p(),g("option",{key:n.id,value:n.id},l(n.nama_pelanggan),9,ee))),128))],512),[[Kt,m.value]])])]),m.value?(p(),g("div",ae,[a("div",ne,[e[6]||(e[6]=a("span",{class:"text-sm font-medium text-muted"},"Hutang Pelanggan",-1)),a("span",{class:E(["text-lg",k.value>0?"text-danger":"text-success"])},l(i(k.value)),3)])])):D("",!0),y.value.length>0?(p(),g("div",se,[a("div",oe,[e[7]||(e[7]=a("div",{class:"w-1 h-6 indicator-bar rounded"},null,-1)),a("p",le," Transaksi Pending ("+l(y.value.length)+") ",1)]),a("div",ie,[(p(!0),g(L,null,G(y.value,n=>(p(),g("div",{key:n.id,class:E(["p-4 border-2 rounded-lg transition cursor-pointer pending-card",n.id===P.value?"pending-card-active":"pending-card-inactive"])},[a("div",re,[a("p",de,l(n.nama_pelanggan),1),a("p",ue,l(i(n.total)),1),a("p",ce,l(n.tanggal_simpan),1)]),a("div",pe,[a("button",{onClick:s=>St(n),class:"btn-primary-small text-sm px-3 py-1.5 rounded-md font-medium transition"}," Muat ",8,me),a("button",{onClick:s=>X(n.id),class:"btn-secondary-small text-sm px-3 py-1.5 rounded-md font-medium transition"}," Hapus ",8,ge)])],2))),128))])])):D("",!0),a("div",fe,[a("div",ve,[a("table",xe,[e[10]||(e[10]=a("thead",null,[a("tr",{class:"table-header border-b"},[a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-left uppercase tracking-wider th-text"},"No"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-left uppercase tracking-wider th-text"},"Produk"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-center uppercase tracking-wider th-text"},"Qty"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-right uppercase tracking-wider th-text"},"Harga"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-right uppercase tracking-wider th-text"},"Subtotal"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-center uppercase tracking-wider th-text"})])],-1)),a("tbody",be,[d.value.length===0?(p(),g("tr",ye,e[8]||(e[8]=[a("td",{colspan:"6",class:"px-6 py-12 text-center text-muted-light"},[a("div",{class:"space-y-2"},[a("svg",{class:"w-12 h-12 mx-auto opacity-40",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[a("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.5",d:"M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"})]),a("p",{class:"text-sm"},"Belum ada produk ditambahkan")])],-1)]))):D("",!0),(p(!0),g(L,null,G(d.value,(n,s)=>(p(),g("tr",{key:n.barcode,class:"table-row-hover transition"},[a("td",he,l(s+1),1),a("td",ke,[a("div",_e,l(n.nama_produk),1)]),a("td",we,[tt(a("input",{"onUpdate:modelValue":b=>n.qty=b,type:"number",min:"1",onChange:b=>Pt(n.barcode,n.qty),class:"input-qty w-20 text-center border rounded-md px-2 py-1 text-sm transition"},null,40,Te),[[it,n.qty,void 0,{number:!0}]])]),a("td",Be,l(i(n.harga_jual_ritel)),1),a("td",Pe,l(i(n.qty*n.harga_jual_ritel)),1),a("td",Ie,[a("button",{type:"button",onClick:b=>ot(n.barcode),class:"btn-icon-delete p-1.5 rounded-md transition"},e[9]||(e[9]=[a("svg",{width:"18",height:"18",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor","stroke-width":"2"},[a("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})],-1)]),8,je)])]))),128))])])]),a("div",Se,[e[11]||(e[11]=a("span",{class:"text-base text-muted-dark"},"Total Belanja",-1)),a("span",Ce,l(i(T.value)),1)])]),a("div",Ae,[a("div",null,[e[13]||(e[13]=a("label",{class:"block text-sm font-medium label-text mb-2"},[et(" Jumlah Bayar "),a("span",{class:"text-danger"},"*")],-1)),a("div",$e,[e[12]||(e[12]=a("span",{class:"absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted"},"Rp",-1)),a("input",{ref_key:"pembayaranInputRef",ref:at,value:M.value||f.value||"",onInput:xt,onFocus:bt,onBlur:yt,onKeydown:qt(ht,["enter"]),type:"text",required:"",placeholder:"0",class:"input-field w-full h-10 pl-12 pr-4 rounded-lg border text-sm transition"},null,40,De)])]),a("div",Ee,[a("div",ze,[e[14]||(e[14]=a("span",{class:"text-muted"},"Hutang Lama:",-1)),a("span",{class:E(["font-semibold",k.value>0?"text-danger":"text-success"])},l(i(k.value)),3)]),a("div",Re,[e[15]||(e[15]=a("span",{class:"text-muted"},"Total Belanja:",-1)),a("span",Ne,l(i(T.value)),1)]),a("div",{class:E(["flex justify-between text-base border-t pt-3 border-divider",J.value>0?"text-orange-custom":"text-body"])},[e[16]||(e[16]=a("span",null,"Total yang Harus Dibayar:",-1)),a("span",null,l(i(J.value)),1)],2),a("div",He,[e[17]||(e[17]=a("span",{class:"text-muted"},"Uang Bayar:",-1)),a("span",Me,l(i(f.value)),1)]),a("div",{class:E(["flex justify-between text-base border-t pt-3 border-divider",j.value>=0?"text-success":"text-danger"])},[a("span",null,l(j.value>=0?"Kembalian":"Sisa Hutang"),1),a("span",null,l(i(Math.abs(j.value))),1)],2)])]),a("div",Ke,[a("button",{ref_key:"submitButtonRef",ref:W,type:"submit",onClick:rt($t,["prevent"]),disabled:R.value||T.value===0||!m.value,class:"md:col-span-2 h-12 btn-submit text-base font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition transform hover:scale-[1.01]"},[R.value?(p(),g("svg",Oe,e[18]||(e[18]=[a("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"},null,-1),a("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"},null,-1)]))):D("",!0),et(" "+l(R.value?"Memproses...":"Proses Transaksi"),1)],8,qe),a("button",{type:"button",onClick:rt(jt,["prevent"]),disabled:d.value.length===0||!m.value,class:"btn-pending h-12 font-medium rounded-lg flex items-center justify-center gap-2 transition"},e[19]||(e[19]=[a("svg",{class:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","stroke-width":"2"},[a("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})],-1),et(" Simpan (Pending) ")]),8,Fe)])])]),_:1}))}}),We=Lt(Le,[["__scopeId","data-v-4aab145d"]]);export{We as default};
